// contentful-migration CLI usage:
// npx contentful-migration --space-id $SPACE_ID --environment-id $ENV_ID --access-token $CMA_TOKEN migration.js

module.exports = function (migration, context) {
  // ========== Helpers ==========
  const urlValidation = [{ regexp: { pattern: 'https?://.*' } }];
  const slugValidation = [{ unique: true }, { regexp: { pattern: '^[a-z0-9-]+$' } }];
  const ogSizeHelp = '1200×630 recommandé';

  // ========== seo ==========
  const seo = migration.createContentType('seo', {
    name: 'SEO',
    description: 'Meta SEO pour pages et fiches',
    displayField: 'seoTitle',
  });
  seo.createField('seoTitle', { name: 'SEO Title', type: 'Symbol', required: true, validations: [{ size: { max: 65 } }]});
  seo.createField('seoDescription', { name: 'SEO Description', type: 'Text', required: true, validations: [{ size: { max: 180 } }]});
  seo.createField('ogImage', { name: 'Open Graph Image', type: 'Link', linkType: 'Asset', required: true });
  seo.createField('canonicalUrl', { name: 'Canonical URL', type: 'Symbol', validations: urlValidation });
  seo.createField('noindex', { name: 'Noindex', type: 'Boolean' });
  seo.createField('structuredData', { name: 'Structured Data (JSON-LD)', type: 'Object' });
  seo.changeEditorInterface('ogImage', 'assetLinkEditor', { helpText: ogSizeHelp });

  // ========== leaf components ==========
  const listItem = migration.createContentType('listItem', {
    name: 'List Item',
    displayField: 'text'
  });
  listItem.createField('text', { name: 'Texte', type: 'Symbol', required: true });

  const highlightItem = migration.createContentType('highlightItem', {
    name: 'Highlight Item',
    displayField: 'text'
  });
  highlightItem.createField('text', { name: 'Texte (1–2 lignes)', type: 'Symbol', required: true });
  highlightItem.createField('icon', { name: 'Icône (optionnel)', type: 'Link', linkType: 'Asset' });

  const galleryItem = migration.createContentType('galleryItem', {
    name: 'Gallery Item',
    displayField: 'alt'
  });
  galleryItem.createField('image', { name: 'Image', type: 'Link', linkType: 'Asset', required: true });
  galleryItem.createField('alt', { name: 'Alt text (obligatoire)', type: 'Symbol', required: true });
  galleryItem.createField('caption', { name: 'Légende', type: 'Symbol' });
  galleryItem.createField('priority', { name: 'Priorité (LCP)', type: 'Boolean' });

  const techTag = migration.createContentType('techTag', {
    name: 'Tech Tag',
    displayField: 'name'
  });
  techTag.createField('name', { name: 'Nom', type: 'Symbol', required: true });
  techTag.createField('kind', { name: 'Catégorie', type: 'Symbol', validations: [{ in: ['lang','framework','library','tool','cloud','design','db','infra'] }]});
  techTag.createField('icon', { name: 'Icône', type: 'Link', linkType: 'Asset' });
  techTag.createField('color', { name: 'Couleur HEX', type: 'Symbol', validations: [{ regexp: { pattern: '^#?[0-9a-fA-F]{6}$' } }]});

  const metricItem = migration.createContentType('metricItem', { name: 'Metric Item', displayField: 'label' });
  metricItem.createField('label', { name: 'Label', type: 'Symbol', required: true });
  metricItem.createField('value', { name: 'Valeur', type: 'Symbol', required: true });
  metricItem.createField('context', { name: 'Contexte', type: 'Symbol' });

  const linkItem = migration.createContentType('linkItem', { name: 'Link Item', displayField: 'label' });
  linkItem.createField('label', { name: 'Label', type: 'Symbol', required: true });
  linkItem.createField('url', { name: 'URL', type: 'Symbol', required: true, validations: urlValidation });
  linkItem.createField('kind', { name: 'Type', type: 'Symbol', validations: [{ in: ['prod','press','repo','doc','other'] }]});

  const testimonial = migration.createContentType('testimonial', { name: 'Testimonial', displayField: 'quote' });
  testimonial.createField('quote', { name: 'Citation', type: 'Text', required: true });
  testimonial.createField('author', { name: 'Auteur·ice', type: 'Symbol' });
  testimonial.createField('roleOrCompany', { name: 'Rôle / Compagnie', type: 'Symbol' });
  testimonial.createField('avatar', { name: 'Avatar', type: 'Link', linkType: 'Asset' });
  testimonial.createField('url', { name: 'Lien', type: 'Symbol', validations: urlValidation });

  const processPhase = migration.createContentType('processPhase', { name: 'Process Phase', displayField: 'title' });
  processPhase.createField('title', { name: 'Titre de phase', type: 'Symbol', required: true });
  processPhase.createField('description', { name: 'Description', type: 'RichText' });
  processPhase.createField('items', { name: 'Points', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['listItem'] }] }});
  processPhase.createField('media', { name: 'Visuels', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['galleryItem'] }] }});
  processPhase.createField('order', { name: 'Ordre', type: 'Integer', required: true });

  const projectMeta = migration.createContentType('projectMeta', { name: 'Project Meta', displayField: 'company' });
  projectMeta.createField('company', { name: 'Compagnie', type: 'Symbol', required: true });
  projectMeta.createField('role', { name: 'Rôle', type: 'Symbol', required: true });
  projectMeta.createField('period', { name: 'Période', type: 'Symbol', required: true });
  projectMeta.createField('sector', { name: 'Secteur', type: 'Symbol' });
  projectMeta.createField('stack', { name: 'Stack (tags)', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['techTag'] }] }});
  projectMeta.createField('links', { name: 'Liens', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['linkItem'] }] }});
  projectMeta.createField('location', { name: 'Lieu', type: 'Symbol' });

  const ctaSection = migration.createContentType('ctaSection', { name: 'CTA Section', displayField: 'title' });
  ctaSection.createField('title', { name: 'Titre', type: 'Symbol', required: true });
  ctaSection.createField('description', { name: 'Description', type: 'Text' });
  ctaSection.createField('ctaText', { name: 'Texte CTA', type: 'Symbol' });
  ctaSection.createField('ctaLink', { name: 'Lien CTA (URL)', type: 'Symbol', validations: urlValidation });
  ctaSection.createField('variant', { name: 'Variante', type: 'Symbol', validations: [{ in: ['light','dark','gradient'] }]});
  ctaSection.createField('illustration', { name: 'Illustration', type: 'Link', linkType: 'Asset' });

  const nextProjectCta = migration.createContentType('nextProjectCta', { name: 'Next Project CTA', displayField: 'label' });
  nextProjectCta.createField('label', { name: 'Libellé', type: 'Symbol', required: true });
  nextProjectCta.createField('target', { name: 'Cible', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['workItem'] }]});

  // ========== workItem (Project | Case Study) ==========
  const workItem = migration.createContentType('workItem', {
    name: 'Work Item (Project | Case Study)',
    description: 'Fiche projet courte ou étude de cas longue',
    displayField: 'title',
  });
  workItem.createField('type', { name: 'Type', type: 'Symbol', required: true, validations: [{ in: ['project','caseStudy'] }]});
  workItem.createField('title', { name: 'Titre', type: 'Symbol', required: true });
  workItem.createField('subtitle', { name: 'Sous-titre', type: 'Symbol' });
  workItem.createField('summary', { name: 'Résumé (case study)', type: 'RichText' });
  workItem.createField('slug', { name: 'Slug', type: 'Symbol', required: true, validations: slugValidation });
  workItem.createField('badge', { name: 'Badge', type: 'Symbol' });
  workItem.createField('cover', { name: 'Cover', type: 'Link', linkType: 'Asset', required: true });
  workItem.createField('projectMeta', { name: 'Meta', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['projectMeta'] }]});
  workItem.createField('overview', { name: 'Overview (projet)', type: 'RichText' });
  workItem.createField('problemStatement', { name: 'Problème & objectifs', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['listItem'] }] }});
  workItem.createField('roleScope', { name: 'Responsabilités', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['listItem'] }] }});
  workItem.createField('process', { name: 'Process (phases)', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['processPhase'] }] }});
  workItem.createField('highlights', { name: 'Points saillants', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['highlightItem'] }] }});
  workItem.createField('metrics', { name: 'Metrics', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['metricItem'] }] }});
  workItem.createField('gallery', { name: 'Galerie', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['galleryItem'] }] }});
  workItem.createField('techStack', { name: 'Tech Stack', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['techTag'] }] }});
  workItem.createField('linksCta', { name: 'Liens (CTA)', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['linkItem'] }] }});
  workItem.createField('testimonial', { name: 'Témoignage', type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['testimonial'] }]});
  workItem.createField('ctaSection', { name: 'CTA Section', type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['ctaSection'] }]});
  workItem.createField('nextProjectCta', { name: 'Next Project CTA', type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['nextProjectCta'] }]});
  workItem.createField('seo', { name: 'SEO', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['seo'] }]});
  workItem.createField('breadcrumbs', { name: 'Breadcrumbs (JSON)', type: 'Object' });
  workItem.changeEditorInterface('slug', 'slugEditor', { helpText: 'Minuscule + tirets, unique' });

  // ========== Page building blocks ==========
  const heroSection = migration.createContentType('heroSection', {
    name: 'Hero Section',
    displayField: 'title'
  });
  heroSection.createField('title', { name: 'Titre', type: 'Symbol', required: true });
  heroSection.createField('description', { name: 'Description', type: 'RichText' });
  heroSection.createField('image', { name: 'Image', type: 'Link', linkType: 'Asset' });
  heroSection.createField('ctaText', { name: 'CTA texte', type: 'Symbol' });
  heroSection.createField('ctaLink', { name: 'CTA lien', type: 'Symbol', validations: urlValidation });
  heroSection.createField('variant', { name: 'Variante', type: 'Symbol', validations: [{ in: ['home','services','projects','about','contact','generic'] }]});

  const projectsGrid = migration.createContentType('projectsGrid', {
    name: 'Projects Grid',
    displayField: 'title'
  });
  projectsGrid.createField('title', { name: 'Titre', type: 'Symbol' });
  projectsGrid.createField('intro', { name: 'Intro', type: 'RichText' });
  projectsGrid.createField('items', { name: 'Éléments', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['workItem'] }]}});

  const contactInfo = migration.createContentType('contactInfo', {
    name: 'Contact Info',
    displayField: 'email'
  });
  contactInfo.createField('city', { name: 'Ville', type: 'Symbol' });
  contactInfo.createField('email', { name: 'Email', type: 'Symbol' });
  contactInfo.createField('phone', { name: 'Téléphone', type: 'Symbol' });
  contactInfo.createField('linkedin', { name: 'LinkedIn', type: 'Symbol', validations: urlValidation });
  contactInfo.createField('ctaText', { name: 'CTA texte', type: 'Symbol' });

  const page = migration.createContentType('page', {
    name: 'Page',
    description: 'Pages CMS (Accueil, Services, Projets, …)',
    displayField: 'title'
  });
  page.createField('title', { name: 'Titre', type: 'Symbol', required: true });
  page.createField('slug', { name: 'Slug', type: 'Symbol', required: true, validations: slugValidation });
  page.createField('sections', {
    name: 'Sections',
    type: 'Array',
    items: {
      type: 'Link',
      linkType: 'Entry',
      validations: [{
        linkContentType: ['heroSection','projectsGrid','ctaSection','contactInfo']
      }]
    }
  });
  page.createField('seo', { name: 'SEO', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['seo'] }]});
  page.changeEditorInterface('slug', 'slugEditor');
};
