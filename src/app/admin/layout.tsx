import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-8">
          <span className="font-bold text-gray-900">Admin panel</span>
          <Link href="/admin/draws"
            className="text-sm text-gray-600 hover:text-purple-600">
            Draws
          </Link>
          <Link href="/admin/users"
            className="text-sm text-gray-600 hover:text-purple-600">
            Users
          </Link>
          <Link href="/admin/winners"
            className="text-sm text-gray-600 hover:text-purple-600">
            Winners
          </Link>
          <Link href="/admin/charities"
            className="text-sm text-gray-600 hover:text-purple-600">
            Charities
          </Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}