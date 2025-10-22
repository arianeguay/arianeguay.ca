// Forms and Form Items Migration
// Usage:
// npx contentful-migration --space-id $SPACE_ID --environment-id $ENV_ID --access-token $CMA_TOKEN migrations/contentful/contentful_forms_migration.js

module.exports = function (migration, context) {
  // 1) Create Form content type
  const form = migration.createContentType('form', {
    name: 'Form',
    displayField: 'title',
    description: 'Reusable form configuration'
  });

  // Form basic info fields (all localized)
  form.createField('title', { 
    name: 'Title', 
    type: 'Symbol', 
    required: true,
    localized: true
  });

  form.createField('description', { 
    name: 'Description', 
    type: 'Text',
    localized: true 
  });

  form.createField('successTitle', { 
    name: 'Success Message Title', 
    type: 'Symbol',
    localized: true 
  });

  form.createField('successMessage', { 
    name: 'Success Message', 
    type: 'Text',
    localized: true 
  });

  form.createField('submitButtonLabel', { 
    name: 'Submit Button Label', 
    type: 'Symbol', 
    required: true,
    localized: true 
  });

  form.createField('resetButtonLabel', { 
    name: 'Reset Button Label (Optional)', 
    type: 'Symbol',
    localized: true 
  });

  form.createField('emailRecipient', { 
    name: 'Email Recipient', 
    type: 'Symbol',
    validations: [
      { regexp: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' } }
    ]
  });

  form.createField('formItems', {
    name: 'Form Items',
    type: 'Array',
    items: {
      type: 'Link',
      linkType: 'Entry',
      validations: [
        { linkContentType: ['formItem'] }
      ]
    }
  });

  form.createField('honeypotEnabled', { 
    name: 'Enable Honeypot Protection', 
    type: 'Boolean',
    required: false
  });

  form.createField('rateLimitMax', { 
    name: 'Rate Limit Max Submissions', 
    type: 'Integer',
    required: false
  });

  form.createField('rateLimitTimeframe', { 
    name: 'Rate Limit Timeframe (ms)', 
    type: 'Integer',
    required: false
  });

  // 2) Create Form Item content type
  const formItem = migration.createContentType('formItem', {
    name: 'Form Item',
    displayField: 'fieldName',
    description: 'Individual form field configuration'
  });

  // Form item fields
  formItem.createField('fieldName', { 
    name: 'Field Name', 
    type: 'Symbol', 
    required: true,
    validations: [
      { regexp: { pattern: '^[a-zA-Z0-9_]+$' } }
    ],
    localized: false
  });

  formItem.createField('fieldType', { 
    name: 'Field Type', 
    type: 'Symbol', 
    required: true,
    validations: [
      { in: ['text', 'email', 'tel', 'textarea', 'select', 'checkbox', 'radio', 'date'] }
    ]
  });

  formItem.createField('label', { 
    name: 'Label', 
    type: 'Symbol', 
    required: true,
    localized: true
  });

  formItem.createField('placeholder', { 
    name: 'Placeholder', 
    type: 'Symbol',
    localized: true
  });

  formItem.createField('helperText', { 
    name: 'Helper Text', 
    type: 'Symbol',
    localized: true
  });

  formItem.createField('required', { 
    name: 'Required', 
    type: 'Boolean',
    required: false
  });

  formItem.createField('maxLength', { 
    name: 'Max Length', 
    type: 'Integer'
  });

  formItem.createField('minLength', { 
    name: 'Min Length', 
    type: 'Integer'
  });

  formItem.createField('pattern', { 
    name: 'Validation Pattern (RegEx)', 
    type: 'Symbol',
    required: false
  });

  formItem.createField('options', {
    name: 'Options',
    type: 'Array',
    items: {
      type: 'Symbol',
      validations: []
    },
    localized: true,
    required: false
  });

  formItem.createField('defaultValue', { 
    name: 'Default Value', 
    type: 'Symbol',
    localized: true
  });

  formItem.createField('order', { 
    name: 'Display Order', 
    type: 'Integer',
    required: false
  });

  // 3) Create Contact Form Entry Type
  const contactForm = migration.createContentType('contactForm', {
    name: 'Contact Form',
    displayField: 'name',
    description: 'Pre-configured contact form'
  });

  contactForm.createField('name', { 
    name: 'Name', 
    type: 'Symbol', 
    required: true
  });

  contactForm.createField('form', {
    name: 'Form Configuration',
    type: 'Link',
    linkType: 'Entry',
    required: true,
    validations: [
      { linkContentType: ['form'] }
    ]
  });

  // 4) Add reference from Page to Contact Form
  try {
    const page = migration.editContentType('page');
    page.createField('contactForm', {
      name: 'Contact Form',
      type: 'Link',
      linkType: 'Entry',
      validations: [
        { linkContentType: ['contactForm'] }
      ]
    });
  } catch (error) {
    console.log('Page content type not found or couldn\'t be modified');
  }

  // 5) Create example form items for contact form
  const createContactFormWithItems = async (locale = 'en-US') => {
    const nameField = {
      fields: {
        fieldName: { [locale]: 'name' },
        fieldType: { [locale]: 'text' },
        label: { [locale]: 'Name' },
        placeholder: { [locale]: 'Your name' },
        required: { [locale]: true },
        maxLength: { [locale]: 100 },
        order: { [locale]: 1 }
      }
    };

    const emailField = {
      fields: {
        fieldName: { [locale]: 'email' },
        fieldType: { [locale]: 'email' },
        label: { [locale]: 'Email' },
        placeholder: { [locale]: 'you@example.com' },
        required: { [locale]: true },
        maxLength: { [locale]: 100 },
        pattern: { [locale]: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
        order: { [locale]: 2 }
      }
    };

    const phoneField = {
      fields: {
        fieldName: { [locale]: 'phone' },
        fieldType: { [locale]: 'tel' },
        label: { [locale]: 'Phone' },
        placeholder: { [locale]: '+1 (555) 123-4567' },
        helperText: { [locale]: 'Optional' },
        required: { [locale]: false },
        maxLength: { [locale]: 20 },
        order: { [locale]: 3 }
      }
    };

    const messageField = {
      fields: {
        fieldName: { [locale]: 'message' },
        fieldType: { [locale]: 'textarea' },
        label: { [locale]: 'Message' },
        placeholder: { [locale]: 'How can we help you?' },
        required: { [locale]: true },
        minLength: { [locale]: 10 },
        maxLength: { [locale]: 1000 },
        order: { [locale]: 4 }
      }
    };

    return [nameField, emailField, phoneField, messageField];
  };

  console.log('✅ Forms migration created successfully');
};
