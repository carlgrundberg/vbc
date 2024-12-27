import type { CollectionConfig } from 'payload'

export const Meetings: CollectionConfig = {
  slug: 'meetings',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'number',
      type: 'number',
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'date',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeFormat: 'HH:mm',
          displayFormat: 'MMMM d, yyyy HH:mm',
        },
      },
      localized: true,
    },
    {
      name: 'host',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'attendees',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
  ],
}
