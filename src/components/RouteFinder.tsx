import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { busStops } from "@/data/busData";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";

const RouteFinder = () => {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (fromStation && toStation) {
      navigate(`/map?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}`);
    }
  };

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };
  
  const StationInput = ({ value, setValue, placeholder }: { value: string, setValue: (val: string) => void, placeholder: string }) => {
    const [open, setOpen] = useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">{placeholder}</span>
            <Input
              value={value}
              onInput={(e) => setValue((e.target as HTMLInputElement).value)}
              onClick={() => setOpen(true)}
              placeholder="..."
              className="rounded-full pl-12 text-md"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
          <Command>
            <CommandInput placeholder="Search for a stop..." />
            <CommandList>
              <CommandEmpty>No stop found.</CommandEmpty>
              <CommandGroup>
                {busStops.map((stop) => (
                  <CommandItem
                    key={stop.id}
                    value={stop.name}
                    onSelect={(currentValue) => {
                      const capitalizedValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1);
                      setValue(capitalizedValue);
                      setOpen(false);
                    }}
                  >
                    {stop.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };


  return (
    <Card className="p-4 sm:p-6 bg-card/80 backdrop-blur-sm border-border max-w-2xl mx-auto rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="w-full sm:w-2/5">
          <StationInput value={fromStation} setValue={setFromStation} placeholder="From" />
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleSwap} className="hidden sm:inline-flex rounded-full">
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
        <div className="w-full sm:hidden text-center my-2">
            <Button variant="ghost" size="icon" onClick={handleSwap} className="rounded-full">
                <ArrowRightLeft className="h-4 w-4 rotate-90" />
            </Button>
        </div>

        <div className="w-full sm:w-2/5">
          <StationInput value={toStation} setValue={setToStation} placeholder="To" />
        </div>
        <div className="w-full sm:w-1/5">
          <Button onClick={handleSearch} className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white">
            <span className="sm:hidden">Find Buses</span>
            <Search className="h-4 w-4 hidden sm:inline-block" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RouteFinder;