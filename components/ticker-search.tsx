"use client"

import { useEffect, useState } from "react"
import { searchTickers, type Company } from "@/lib/fakeApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronsUpDown } from "lucide-react"

interface TickerSearchProps {
  onSelect: (company: Company) => void
  placeholder?: string
}

export function TickerSearch({ onSelect, placeholder = "Search stocks..." }: TickerSearchProps) {
  const [open, setOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const handleSearch = async () => {
      if (query.length === 0) {
        setCompanies([])
        return
      }
      setLoading(true)
      const results = await searchTickers(query)
      setCompanies(results)
      setLoading(false)
    }

    const timer = setTimeout(handleSearch, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {query || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0"
          />
          <CommandList>
            {loading && <CommandEmpty>Searching...</CommandEmpty>}
            {!loading && companies.length === 0 && query && <CommandEmpty>No stocks found.</CommandEmpty>}
            {companies.length > 0 && (
              <CommandGroup>
                {companies.map((company) => (
                  <CommandItem
                    key={company.symbol}
                    value={company.symbol}
                    onSelect={() => {
                      onSelect(company)
                      setQuery("")
                      setOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{company.symbol}</span>
                      <span className="text-xs text-muted-foreground">{company.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
