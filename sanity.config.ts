import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {bookingCalendarPlugin} from './src/sanity/plugins/bookingCalendar'

export default defineConfig({
  name: 'default',
  title: 'hotel-management-app',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string, 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,

  basePath: "/studio",

  plugins: [structureTool(), visionTool(), bookingCalendarPlugin()],

  schema: {
    types: schemaTypes,
  },
})
