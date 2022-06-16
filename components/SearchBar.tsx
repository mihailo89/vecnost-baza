import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Spinner, Magnifier, AdjustmentsIcon, Cross } from "./Icons";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { User } from "@supabase/supabase-js";
import uniqBy from "lodash.uniqby";
import create from "zustand";
import shallow from "zustand/shallow";

interface Option {
  name: string;
  id: string;
}

enum Regions {
  opstina = "opstina",
  okrug = "okrug",
  groblje = "groblje",
}

interface Result {
  grobljeid: string;
  grobljename: string;
  opstinaid: string;
  opstinaname: string;
  okrugid: string;
  okrugname: string;
}

interface SearchState {
  optionsShown: boolean;
  allOptions: Result[];
  options: {
    [key in Regions]: Option[];
  };
  filter: {
    [key in Regions]: string | null;
  };
  setOption: (name: keyof typeof Regions, value: string) => void;
  clearOption: (name: string) => void;
  showOptions: () => void;
}

interface OptionDropdownProps {
  def: keyof typeof Regions;
  options: Option[];
  choice: string | null;
  setChoice: SearchState["setOption"];
  clearChoice: () => void;
}

const generateOptions = (
  data: Result[],
  filters: { [key in Regions]?: string }
): SearchState["options"] => {
  if (filters?.opstina && filters.opstina !== "0") {
    data = data.filter((row: Result) => row.opstinaid === filters.opstina);
  }
  if (filters?.okrug && filters.okrug !== "0") {
    data = data.filter((row: Result) => row.okrugid === filters.okrug);
  }
  if (filters?.groblje && filters.groblje !== "0") {
    data = data.filter((row: Result) => row.grobljeid === filters.groblje);
  }

  return {
    okrug: uniqBy(
      data.map((row: Result) => ({
        name: row.okrugname,
        id: row.okrugid,
      })),
      "id"
    ),
    opstina: uniqBy(
      data.map((row: Result) => ({
        name: row.opstinaname,
        id: row.opstinaid,
      })),
      "id"
    ),
    groblje: uniqBy(
      data.map((row: Result) => ({
        name: row.grobljename,
        id: row.grobljeid,
      })),
      "id"
    ),
  };
};

const useStore = create<SearchState>((set, get) => ({
  optionsShown: false,
  allOptions: [],
  options: {
    okrug: [],
    opstina: [],
    groblje: [],
  },
  filter: {
    opstina: null,
    groblje: null,
    okrug: null,
  },
  setOption: (name, value) => {
    const options = generateOptions(get().allOptions, { [name]: value });
    options[name] = get().options[name];
    set(() => ({ filter: { ...get().filter, [name]: value }, options }));
  },
  clearOption: (name) => {
    const options = generateOptions(get().allOptions, { [name]: "0" });
    set(() => ({ filter: { ...get().filter, [name]: null }, options }));
  },
  showOptions: async () => {
    if (get().allOptions.length === 0) {
      const { data } = await supabaseClient.rpc<Result>("region_data");
      const options = generateOptions(data || [], {});

      set(() => ({
        optionsShown: true,
        allOptions: data || [],
        options,
      }));
      return;
    }
    set((state) => ({ optionsShown: !state.optionsShown }));
  },
}));

const OptionDropdown = ({
  def,
  options,
  choice,
  setChoice,
  clearChoice,
}: OptionDropdownProps) => {
  if (choice !== null) {
    return (
      <div
        className="flex w-1/3 flex-grow items-center justify-between bg-white p-2 text-center text-sm capitalize hover:cursor-pointer"
        onClick={clearChoice}
      >
        <div className="flex w-full justify-center text-center">
          <span>{options.find((option) => option.id == choice)?.name}</span>
        </div>
        <div>
          <Cross />
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return null;
  }

  return (
    <select
      onChange={(e) => setChoice(def, e.target.value)}
      className="w-1/3 bg-white p-2 text-center text-sm capitalize"
    >
      <option className="text-clip text-xs" value="0" label={def} />
      {options.map((option) => (
        <option
          className="text-clip text-xs"
          key={option.id}
          value={option.id}
          label={option.name}
        />
      ))}
    </select>
  );
};

const AdvancedOptions = () => {
  const [filter, options, setOption, clearOption] = useStore(
    (state) => [
      state.filter,
      state.options,
      state.setOption,
      state.clearOption,
    ],
    shallow
  );

  return (
    <div className="mb-10">
      <div className="flex h-10 items-center justify-between">
        <OptionDropdown
          def="okrug"
          choice={filter.okrug}
          options={options.okrug}
          setChoice={setOption}
          clearChoice={() => clearOption("okrug")}
        />
        <OptionDropdown
          def="opstina"
          choice={filter.opstina}
          options={options.opstina}
          setChoice={setOption}
          clearChoice={() => clearOption("opstina")}
        />
        <OptionDropdown
          def="groblje"
          choice={filter.groblje}
          options={options.groblje}
          setChoice={setOption}
          clearChoice={() => clearOption("groblje")}
        />
      </div>
    </div>
  );
};

export default function SearchBar({
  searching,
  user,
}: {
  searching: boolean;
  user: User;
}) {
  const router = useRouter();
  const { opstina, groblje, okrug, ime } = router.query;
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const [search, setSearch] = useState<string | string[]>("");
  const [optionsShown, showOptions, filters, setOption] = useStore(
    (state) => [
      state.optionsShown,
      state.showOptions,
      state.filter,
      state.setOption,
    ],
    shallow
  );

  useEffect(() => {
    setSearch(ime || "");
    if (opstina || groblje || okrug) {
      if (!optionsShown && user) {
        showOptions();
      }
    }
    if (opstina && typeof opstina === "string") {
      setOption("opstina", opstina);
    }
    if (groblje && typeof groblje === "string") {
      setOption("groblje", groblje);
    }
    if (okrug && typeof okrug === "string") {
      setOption("okrug", okrug);
    }
  }, [
    ime,
    opstina,
    groblje,
    okrug,
    user,
    setOption,
    showOptions,
    optionsShown,
  ]);

  const handleSearch = useCallback(
    (searchInput: string | string[]) => {
      if (typeof searchInput !== "string") {
        searchInput = searchInput.join(" ");
      }
      const cleanedInput = searchInput.replace(/dj/g, "đ").replace(/Dj/g, "Đ");

      router.push({
        pathname: "/search",
        query: {
          ime: cleanedInput,
          ...(filters.groblje && { groblje: filters.groblje }),
          ...(filters.opstina && { opstina: filters.opstina }),
          ...(filters.okrug && { okrug: filters.okrug }),
        },
      });
    },
    [router, filters]
  );

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => setSearch(e.currentTarget.value),
    [setSearch]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) =>
      e.key == "Enter" && handleSearch(e.currentTarget.value),
    [handleSearch]
  );

  return (
    <div ref={parent} className="m-auto max-w-3xl">
      <div className="flex items-center justify-center rounded-md border border-gray-300">
        <div className="flex h-16 w-full flex-shrink items-center space-x-8 hover:shadow-md">
          <input
            type="text"
            name="search"
            id="search"
            value={search}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            placeholder="Pretraga..."
            className="h-full flex-grow p-5 focus:outline-none"
          />
        </div>
        <div className="flex h-16 w-28 flex-grow border-l ">
          <button
            className="flex h-full w-full flex-grow items-center justify-center border-r hover:shadow-md"
            onClick={() => handleSearch(search)}
          >
            {searching ? <Spinner /> : <Magnifier />}
          </button>
          <button
            className="flex h-full w-10 items-center justify-center hover:shadow-md"
            onClick={showOptions}
          >
            <AdjustmentsIcon
              className={`h-5 w-5 ${optionsShown ? "text-gray-400" : ""}`}
            />
          </button>
        </div>
      </div>
      {optionsShown && <AdvancedOptions />}
    </div>
  );
}
