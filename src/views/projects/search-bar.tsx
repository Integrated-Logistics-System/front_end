import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="프로젝트 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </CardContent>
  </Card>
)
