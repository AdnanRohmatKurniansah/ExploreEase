'use client'

import { Button } from '@/app/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { Calendar } from '@/app/components/ui/calendar'

const DatePicker = () => {
  const [date, setDate] = useState<Date>()

  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" data-empty={!date} className="data-[empty=true]:text-muted-foreground hover:bg-white w-full justify-start text-left font-normal">
                <CalendarIcon className='w-4 me-2' /> {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
    </Popover>
  )
}

export default DatePicker