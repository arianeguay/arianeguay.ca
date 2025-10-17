// Refactor CTA fields into reusable `cta` entries
// Usage:
// npx contentful-migration --space-id $SPACE_ID --environment-id $ENV_ID --access-token $CMA_TOKEN migrations/contentful/contentful_cta_refactor.js

module.exports = function (migration, context) {
  const urlValidation = [{ regexp: { pattern: 'https?://.*' } }];

  // 1) New CTA content type
  const cta = migration.createContentType('cta', {
    name: 'CTA',
    displayField: 'label',
    description: 'Reusable call-to-action (button/link)'
  });
  cta.createField('label', { name: 'Label', type: 'Symbol', required: true });
  cta.createField('url', { name: 'URL', type: 'Symbol', required: true, validations: urlValidation });
  cta.createField('style', { name: 'Style', type: 'Symbol', validations: [{ in: ['primary','secondary','link'] }] });
  cta.createField('newTab', { name: 'Open in new tab', type: 'Boolean' });

  // 2) Update heroSection: add reference field `cta`
  const hero = migration.editContentType('heroSection');
  hero.createField('cta', {
    name: 'CTA',
    type: 'Link',
    linkType: 'Entry',
    validations: [{ linkContentType: ['cta'] }]
  });

  // 3) Update ctaSection: add reference field `primaryCta`
  const ctaSection = migration.editContentType('ctaSection');
  ctaSection.createField('primaryCta', {
    name: 'Primary CTA',
    type: 'Link',
    linkType: 'Entry',
    validations: [{ linkContentType: ['cta'] }]
  });

  // 4) Derive linked CTA entries for heroSection from ctaText/ctaLink
  migration.deriveLinkedEntries({
    contentType: 'heroSection',
    from: ['ctaText', 'ctaLink'],
    toReferenceField: 'cta',
    derivedContentType: 'cta',
    derivedFields: ['label', 'url', 'style', 'newTab'],
    identityKey: async (fromFields, locale) => {
      const label = fromFields.ctaText && fromFields.ctaText[locale];
      const url = fromFields.ctaLink && fromFields.ctaLink[locale];
      if (!label || !url) return null;
      return `${label}::${url}`; // stable per locale
    },
    deriveEntryForLocale: async (fromFields, locale) => {
      const label = fromFields.ctaText && fromFields.ctaText[locale];
      const url = fromFields.ctaLink && fromFields.ctaLink[locale];
      if (!label || !url) return;
      return {
        fields: {
          label: { [locale]: label },
          url: { [locale]: url },
          style: { [locale]: 'primary' },
          newTab: { [locale]: false }
        }
      };
    }
  });

  // 5) Derive linked CTA entries for ctaSection from ctaText/ctaLink -> primaryCta
  migration.deriveLinkedEntries({
    contentType: 'ctaSection',
    from: ['ctaText', 'ctaLink'],
    toReferenceField: 'primaryCta',
    derivedContentType: 'cta',
    derivedFields: ['label', 'url', 'style', 'newTab'],
    identityKey: async (fromFields, locale) => {
      const label = fromFields.ctaText && fromFields.ctaText[locale];
      const url = fromFields.ctaLink && fromFields.ctaLink[locale];
      if (!label || !url) return null;
      return `ctaSection:${label}::${url}`;
    },
    deriveEntryForLocale: async (fromFields, locale) => {
      const label = fromFields.ctaText && fromFields.ctaText[locale];
      const url = fromFields.ctaLink && fromFields.ctaLink[locale];
      if (!label || !url) return;
      return {
        fields: {
          label: { [locale]: label },
          url: { [locale]: url },
          style: { [locale]: 'primary' },
          newTab: { [locale]: false }
        }
      };
    }
  });

  // 6) Remove old fields after derivation (safe even if some entries had no CTA)
  hero.deleteField('ctaText');
  hero.deleteField('ctaLink');
  ctaSection.deleteField('ctaText');
  ctaSection.deleteField('ctaLink');
};
