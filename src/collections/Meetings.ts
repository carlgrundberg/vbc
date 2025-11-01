import type { CollectionConfig } from 'payload';
import { beforeChangeMeetings } from './hooks/beforeChangeMeetings';

export const Meetings: CollectionConfig = {
  slug: 'meetings',
  admin: {
    useAsTitle: 'title',
    pagination: {},
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [beforeChangeMeetings],
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
    {
      name: 'coverPhoto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'flights',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Optional name for this flight',
          },
        },
        {
          name: 'items',
          type: 'array',
          required: true,
          admin: {
            description: 'Ordered list of items (beers) in this flight',
          },
          fields: [
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: {
                description: 'Link to Untappd or other source',
              },
            },
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'Beer title (auto-filled from URL)',
              },
            },
            {
              name: 'brewery',
              type: 'text',
              admin: {
                description: 'Brewery name (auto-filled from URL)',
              },
            },
            {
              name: 'style',
              type: 'text',
              admin: {
                description: 'Beer style (auto-filled from URL)',
              },
            },
            {
              name: 'abv',
              type: 'number',
              admin: {
                description: 'Alcohol by volume (auto-filled from URL)',
                step: 0.1,
              },
            },
            {
              name: 'ibu',
              type: 'number',
              admin: {
                description: 'International Bitterness Units (auto-filled from URL)',
                step: 1,
              },
            },
          ],
        },
      ],
    },
  ],
};
