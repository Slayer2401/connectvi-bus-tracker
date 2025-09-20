import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, ArrowRightLeft } from "lucide-react";
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
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="rounded-full"
          />
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
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
                      setValue(currentValue);
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
    <Card className="p-4 sm:p-6 bg-card/80 backdrop-blur-sm border-border max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="w-full sm:w-2/5">
          <StationInput value={fromStation} setValue={setFromStation} placeholder="From Station" />
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleSwap} className="hidden sm:inline-flex">
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
        <div className="w-full sm:hidden text-center my-2">
            <ArrowRightLeft className="h-4 w-4 inline-block rotate-90" />
        </div>

        <div className="w-full sm:w-2/5">
          <StationInput value={toStation} setValue={setToStation} placeholder="To Station" />
        </div>
        <div className="w-full sm:w-1/5">
          <Button onClick={handleSearch} className="w-full rounded-full">
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Find Buses</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Need to add Card to the import list
import { Card } from "@/components/ui/card";
export default RouteFinder;