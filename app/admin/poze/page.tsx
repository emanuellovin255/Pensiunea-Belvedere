import { redirect } from 'next/navigation'

import { Biblioteca } from '@/components/admin/Biblioteca'
import { areSesiune } from '@/lib/admin/sesiune'

export default async function PaginaPoze() {
  if (!(await areSesiune())) redirect('/admin/intra')
  return <Biblioteca />
}
