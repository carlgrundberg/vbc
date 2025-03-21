import type { CollectionConfig } from 'payload'

export const Meetings: CollectionConfig = {
  slug: 'meetings',
  admin: {
    useAsTitle: 'title',
    pagination: {},
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'number',
      type: 'number',
      unique: true,
      required: true,
      admin: {
        step: 1,
      },
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
          displayFormat: 'd MMMM, yyyy HH:mm',
        },
      },
      localized: true,
      required: true,
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
