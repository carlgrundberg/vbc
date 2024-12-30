import type { CollectionConfig } from 'payload'

export const Meetings: CollectionConfig = {
  slug: 'meetings',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
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
      name: 'hosts',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'attendees',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
  ],
}
