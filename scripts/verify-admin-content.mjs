#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = process.cwd();
const errors = [];
const warnings = [];
const dataByFile = new Map();

const contentFiles = [
  "src/content/site.json",
  "src/content/pages.json",
  "src/content/services.json",
  "src/content/portfolio.json",
  "src/content/testimonials.json",
  "src/content/credentials.json",
  "src/content/form-config.json",
];

const builtPages = {
  home: "dist/index.html",
  portfolio: "dist/portfolio/index.html",
  services: "dist/services/index.html",
  about: "dist/about/index.html",
  contact: "dist/contact/index.html",
  admin: "dist/admin/index.html",
};

function readText(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function addError(message) {
  errors.push(message);
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isBlank(value) {
  return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
}

function fieldPath(parent, name) {
  return parent ? `${parent}.${name}` : name;
}

function validateFields(fields, value, file, parentPath = "") {
  if (!Array.isArray(fields)) {
    addError(`${file}: ${parentPath || "root"} has no Decap field list.`);
    return;
  }

  if (!isObject(value)) {
    addError(`${file}: ${parentPath || "root"} should be an object.`);
    return;
  }

  const fieldNames = new Set();

  for (const field of fields) {
    if (!field?.name) {
      addError(`${file}: ${parentPath || "root"} has a Decap field without a name.`);
      continue;
    }

    fieldNames.add(field.name);
    const nextPath = fieldPath(parentPath, field.name);
    const hasValue = Object.hasOwn(value, field.name);
    const currentValue = value[field.name];
    const optional = field.required === false;

    if (!hasValue) {
      if (!optional) addError(`${file}: missing CMS-managed value ${nextPath}.`);
      continue;
    }

    if (!optional && isBlank(currentValue)) {
      addError(`${file}: required CMS-managed value ${nextPath} is blank.`);
    }

    if (field.widget === "object") {
      validateFields(field.fields, currentValue, file, nextPath);
    }

    if (field.widget === "list") {
      if (!Array.isArray(currentValue)) {
        addError(`${file}: ${nextPath} should be a list.`);
        continue;
      }

      if (field.fields) {
        currentValue.forEach((item, index) => {
          validateFields(field.fields, item, file, `${nextPath}[${index}]`);
        });
      }
    }

    if (field.widget === "select" && !isBlank(currentValue)) {
      const allowed = field.options?.map((option) => (typeof option === "string" ? option : option.value));
      if (Array.isArray(allowed) && !allowed.includes(currentValue)) {
        addError(`${file}: ${nextPath} value "${currentValue}" is not allowed by Decap options.`);
      }
    }

    if (field.widget === "number" && typeof currentValue !== "number") {
      addError(`${file}: ${nextPath} should be a number.`);
    }
  }

  for (const key of Object.keys(value)) {
    if (!fieldNames.has(key)) {
      addError(`${file}: ${fieldPath(parentPath, key)} exists in JSON but is not editable in Decap.`);
    }
  }
}

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&nbsp;", " ");
}

function visibleText(html) {
  return decodeEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function normalize(value) {
  return decodeEntities(String(value))
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function loadBuiltPages() {
  const pages = {};

  for (const [name, file] of Object.entries(builtPages)) {
    if (!exists(file)) {
      addError(`${file} is missing. Run npm run build before npm run verify:admin.`);
      continue;
    }

    const html = readText(file);
    pages[name] = {
      file,
      raw: html,
      rawNormalized: normalize(html),
      textNormalized: normalize(visibleText(html)),
    };
  }

  return pages;
}

function assertText(pages, pageName, value, label) {
  if (isBlank(value)) return;
  const page = pages[pageName];
  if (!page) return;
  const needle = normalize(value);
  if (!page.textNormalized.includes(needle)) {
    addError(`${page.file}: missing rendered text for ${label}: "${String(value).slice(0, 90)}"`);
  }
}

function assertRaw(pages, pageName, value, label) {
  if (isBlank(value)) return;
  const page = pages[pageName];
  if (!page) return;
  const needle = normalize(value);
  if (!page.rawNormalized.includes(needle)) {
    addError(`${page.file}: missing rendered markup for ${label}: "${String(value).slice(0, 90)}"`);
  }
}

function assertPageGroup(pages, pageName, values, label) {
  values.forEach((value, index) => assertText(pages, pageName, value, `${label}[${index}]`));
}

function collectStrings(value, callback, parentPath = "") {
  if (typeof value === "string") {
    callback(value, parentPath);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, callback, `${parentPath}[${index}]`));
    return;
  }

  if (isObject(value)) {
    Object.entries(value).forEach(([key, item]) => collectStrings(item, callback, fieldPath(parentPath, key)));
  }
}

function assertUnique(items, key, label) {
  const seen = new Set();

  for (const item of items) {
    const value = item[key];
    if (isBlank(value)) {
      addError(`${label}: blank ${key}.`);
      continue;
    }

    if (seen.has(value)) addError(`${label}: duplicate ${key} "${value}".`);
    seen.add(value);
  }
}

function validateBusinessRules() {
  const site = dataByFile.get("src/content/site.json");
  const services = dataByFile.get("src/content/services.json");
  const portfolio = dataByFile.get("src/content/portfolio.json");
  const testimonials = dataByFile.get("src/content/testimonials.json");
  const credentials = dataByFile.get("src/content/credentials.json");
  const form = dataByFile.get("src/content/form-config.json");

  assertUnique(services.services, "slug", "Services");
  assertUnique(portfolio.portfolio, "id", "Portfolio");

  const serviceNames = new Set(services.services.map((service) => service.name));
  const requiredFormFields = new Set(["fullName", "email", "propertyAddress", "city", "state", "zipCode", "servicesNeeded"]);
  const allowedFieldTypes = new Set(["text", "email", "tel", "number", "select", "textarea", "checkbox-group"]);
  const formNames = new Set();

  for (const field of form.fields) {
    if (formNames.has(field.name)) addError(`Booking form: duplicate field name "${field.name}".`);
    formNames.add(field.name);

    if (!allowedFieldTypes.has(field.type)) {
      addError(`Booking form: unsupported type "${field.type}" for ${field.name}.`);
    }

    if ((field.type === "select" || field.type === "checkbox-group") && !Array.isArray(field.options)) {
      addError(`Booking form: ${field.name} needs options for type ${field.type}.`);
    }
  }

  for (const name of requiredFormFields) {
    const field = form.fields.find((candidate) => candidate.name === name);
    if (!field) addError(`Booking form: missing required workflow field "${name}".`);
    if (field && field.required !== true) addError(`Booking form: workflow field "${name}" should be required.`);
  }

  const servicesNeeded = form.fields.find((field) => field.name === "servicesNeeded");
  servicesNeeded?.options?.forEach((option) => {
    if (!serviceNames.has(option)) {
      addError(`Booking form: servicesNeeded option "${option}" does not match a service name.`);
    }
  });

  if (!portfolio.portfolio.some((item) => item.featured)) {
    addError("Portfolio: at least one item should be featured for the homepage.");
  }

  for (const testimonial of testimonials.testimonials) {
    if (!Number.isInteger(testimonial.stars) || testimonial.stars < 1 || testimonial.stars > 5) {
      addError(`Testimonials: ${testimonial.name} has invalid stars value ${testimonial.stars}.`);
    }
  }

  const serviceIcons = new Set(["PH", "DR", "VD"]);
  services.services.forEach((service) => {
    if (!serviceIcons.has(service.icon)) addError(`Services: ${service.name} has unsupported icon "${service.icon}".`);
  });

  const credentialIcons = new Set(["PRO", "FAA", "PPL", "NAV"]);
  credentials.credentials.forEach((credential) => {
    if (!credentialIcons.has(credential.icon)) {
      addError(`Credentials: ${credential.title} has unsupported icon "${credential.icon}".`);
    }
  });

  collectStrings({ site, services, portfolio, credentials }, (value, pointer) => {
    if (!value.startsWith("/images/")) return;

    const assetFile = path.join("public", value.replace(/^\//, ""));
    if (!exists(assetFile)) {
      addError(`Missing referenced image ${value} at ${assetFile} (${pointer}).`);
    }
  });
}

function validateBuiltContent() {
  const pages = loadBuiltPages();
  const site = dataByFile.get("src/content/site.json");
  const pageCopy = dataByFile.get("src/content/pages.json");
  const services = dataByFile.get("src/content/services.json").services;
  const portfolio = dataByFile.get("src/content/portfolio.json").portfolio;
  const testimonials = dataByFile.get("src/content/testimonials.json").testimonials;
  const credentials = dataByFile.get("src/content/credentials.json").credentials;
  const form = dataByFile.get("src/content/form-config.json");

  for (const pageName of ["home", "portfolio", "services", "about", "contact"]) {
    assertText(pages, pageName, site.businessName, "businessName");
    assertText(pages, pageName, site.footer.description, "footer.description");
    assertText(pages, pageName, site.contact.phone, "contact.phone");
    assertText(pages, pageName, site.contact.email, "contact.email");
  }

  assertText(pages, "home", site.hero.eyebrow, "site.hero.eyebrow");
  assertText(pages, "home", site.hero.heading, "site.hero.heading");
  assertText(pages, "home", site.hero.description, "site.hero.description");
  assertRaw(pages, "home", site.hero.image.src, "site.hero.image.src");
  assertRaw(pages, "home", site.hero.image.alt, "site.hero.image.alt");
  assertText(pages, "home", site.aboutPreview.heading, "site.aboutPreview.heading");
  assertPageGroup(pages, "home", site.aboutPreview.paragraphs, "site.aboutPreview.paragraphs");
  assertRaw(pages, "home", site.aboutImage.src, "site.aboutImage.src");
  assertRaw(pages, "home", site.aboutImage.alt, "site.aboutImage.alt");
  assertText(pages, "home", site.aboutImage.captionTitle, "site.aboutImage.captionTitle");
  assertText(pages, "home", site.aboutImage.captionText, "site.aboutImage.captionText");

  for (const section of ["aboutSection", "servicesSection", "portfolioSection", "testimonialsSection", "credentialsSection", "cta"]) {
    collectStrings(pageCopy.home[section], (value, pointer) => assertText(pages, "home", value, `pages.home.${section}.${pointer}`));
  }

  services.slice(0, 3).forEach((service) => {
    assertText(pages, "home", service.name, `home service ${service.slug} name`);
    assertText(pages, "home", service.shortDescription, `home service ${service.slug} shortDescription`);
    assertText(pages, "home", service.startingPrice, `home service ${service.slug} startingPrice`);
  });

  portfolio.filter((item) => item.featured).slice(0, 4).forEach((item) => {
    assertText(pages, "home", item.title, `home portfolio ${item.id} title`);
    assertText(pages, "home", item.location, `home portfolio ${item.id} location`);
    assertRaw(pages, "home", item.image, `home portfolio ${item.id} image`);
    assertRaw(pages, "home", item.alt, `home portfolio ${item.id} alt`);
  });

  testimonials.slice(0, 3).forEach((testimonial) => {
    assertText(pages, "home", testimonial.quote, `home testimonial ${testimonial.name} quote`);
    assertText(pages, "home", testimonial.name, `home testimonial ${testimonial.name} name`);
    assertText(pages, "home", testimonial.role, `home testimonial ${testimonial.name} role`);
  });

  credentials.slice(0, 4).forEach((credential) => {
    assertText(pages, "home", credential.title, `home credential ${credential.title} title`);
    assertText(pages, "home", credential.description, `home credential ${credential.title} description`);
  });

  collectStrings(pageCopy.portfolio, (value, pointer) => assertText(pages, "portfolio", value, `pages.portfolio.${pointer}`));
  portfolio.forEach((item) => {
    assertRaw(pages, "portfolio", `id="${item.id}"`, `portfolio ${item.id} id`);
    assertText(pages, "portfolio", item.title, `portfolio ${item.id} title`);
    assertText(pages, "portfolio", item.category, `portfolio ${item.id} category`);
    assertText(pages, "portfolio", item.location, `portfolio ${item.id} location`);
    assertRaw(pages, "portfolio", item.image, `portfolio ${item.id} image`);
    assertRaw(pages, "portfolio", item.alt, `portfolio ${item.id} alt`);
  });

  collectStrings(pageCopy.services, (value, pointer) => assertText(pages, "services", value, `pages.services.${pointer}`));
  services.forEach((service) => {
    assertRaw(pages, "services", `id="${service.slug}"`, `service ${service.slug} anchor`);
    assertText(pages, "services", service.shortLabel, `service ${service.slug} shortLabel`);
    assertText(pages, "services", service.name, `service ${service.slug} name`);
    assertText(pages, "services", service.shortDescription, `service ${service.slug} shortDescription`);
    assertText(pages, "services", service.longDescription, `service ${service.slug} longDescription`);
    assertText(pages, "services", service.startingPrice, `service ${service.slug} startingPrice`);
    service.features.forEach((feature) => assertText(pages, "services", feature, `service ${service.slug} feature`));
    service.pricingRows.forEach((row) => {
      assertText(pages, "services", row.label, `service ${service.slug} pricing label`);
      assertText(pages, "services", row.price, `service ${service.slug} pricing price`);
    });
  });

  collectStrings(pageCopy.about, (value, pointer) => assertText(pages, "about", value, `pages.about.${pointer}`));
  assertText(pages, "about", site.aboutPreview.heading, "about site.aboutPreview.heading");
  assertPageGroup(pages, "about", site.aboutPreview.paragraphs, "about site.aboutPreview.paragraphs");
  assertRaw(pages, "about", site.aboutImage.src, "about site.aboutImage.src");
  assertRaw(pages, "about", site.aboutImage.alt, "about site.aboutImage.alt");
  assertText(pages, "about", site.aboutImage.captionTitle, "about site.aboutImage.captionTitle");
  assertText(pages, "about", site.aboutImage.captionText, "about site.aboutImage.captionText");
  credentials.forEach((credential) => {
    assertText(pages, "about", credential.title, `about credential ${credential.title} title`);
    assertText(pages, "about", credential.description, `about credential ${credential.title} description`);
  });

  collectStrings(pageCopy.contact, (value, pointer) => assertText(pages, "contact", value, `pages.contact.${pointer}`));
  assertText(pages, "contact", site.contact.intro, "site.contact.intro");
  assertText(pages, "contact", site.contact.hours, "site.contact.hours");
  site.contact.serviceArea.forEach((area) => assertText(pages, "contact", area, "site.contact.serviceArea"));
  assertText(pages, "contact", form.intro, "form.intro");
  assertText(pages, "contact", form.note, "form.note");
  assertText(pages, "contact", form.submitLabel, "form.submitLabel");
  form.fields.forEach((field) => {
    assertText(pages, "contact", field.label, `form field ${field.name} label`);
    assertRaw(pages, "contact", `name="${field.name}"`, `form field ${field.name} name`);
    assertRaw(pages, "contact", field.placeholder, `form field ${field.name} placeholder`);
    field.options?.forEach((option) => assertText(pages, "contact", option, `form field ${field.name} option`));
  });

  if (site.booking.calendlyUrl) {
    assertRaw(pages, "contact", site.booking.calendlyUrl, "site.booking.calendlyUrl");
  } else {
    assertText(pages, "contact", "Calendly URL placeholder", "empty Calendly fallback");
  }

  if (!exists("dist/admin/config.yml")) {
    addError("dist/admin/config.yml is missing. Decap needs public/admin/config.yml copied into the built site.");
  }

  assertRaw(pages, "admin", "decap-cms", "admin Decap script");
}

function main() {
  const configFile = "public/admin/config.yml";
  const config = YAML.parse(readText(configFile));
  const cmsFiles = [];

  config.collections?.forEach((collection) => {
    collection.files?.forEach((file) => {
      cmsFiles.push(file);
    });
  });

  const cmsFileNames = new Set(cmsFiles.map((file) => file.file));

  for (const file of contentFiles) {
    if (!cmsFileNames.has(file)) {
      addError(`${file} is not registered in ${configFile}.`);
    }
  }

  for (const file of cmsFiles) {
    if (!exists(file.file)) {
      addError(`${file.file} is configured in Decap but does not exist.`);
      continue;
    }

    const data = JSON.parse(readText(file.file));
    dataByFile.set(file.file, data);
    validateFields(file.fields, data, file.file);
  }

  for (const contentFile of contentFiles) {
    if (!dataByFile.has(contentFile) && exists(contentFile)) {
      dataByFile.set(contentFile, JSON.parse(readText(contentFile)));
    }
  }

  validateBusinessRules();
  validateBuiltContent();

  if (warnings.length) {
    console.warn("Admin/content verification warnings:");
    warnings.forEach((warning) => console.warn(`- ${warning}`));
  }

  if (errors.length) {
    console.error("Admin/content verification failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Admin/content verification passed.");
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
