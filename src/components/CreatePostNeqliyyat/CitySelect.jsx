import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";


const cities = [
  "Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", "Şirvan", "Naftalan", "Yevlax",
  "Abşeron", "Ağdaş", "Ağsu", "Astara", "Beyləqan", "Balakən", "Biləsuvar",
  "Cəlilabad", "Cəbrayıl", "Füzuli", "Gədəbəy", "Goranboy", "Göyçay", "Hacıqabul",
  "Xaçmaz", "Xızı", "Xocalı", "Xocavənd", "İmişli", "İsmayıllı", "Kəlbəcər",
  "Kürdəmir", "Qax", "Qazax", "Qəbələ", "Qobustan", "Quba", "Qubadlı", "Qusar",
  "Laçın", "Lənkəran", "Lerik", "Masallı", "Neftçala", "Oğuz", "Ordubad", "Saatlı",
  "Sabirabad", "Salyan", "Şamaxı", "Samux", "Şəki", "Siyəzən", "Şuşa", "Tərtər",
  "Tovuz", "Ucar", "Xankəndi", "Zaqatala", "Zərdab"
];

export default function CitySelect({ selectedCity, setSelectedCity }) {
  const [query, setQuery] = useState("");

  const filteredCities =
    query === ""
      ? cities
      : cities.filter((location) =>
          location.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={selectedCity} onChange={setSelectedCity} nullable>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full border border-green-300/100 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(location) => location}
          placeholder="Yerləşdiyi şəhəri seçin"
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
        </Combobox.Button>

        {filteredCities.length > 0 && (
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {filteredCities.map((location) => (
              <Combobox.Option
                key={location}
                value={location}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-green-100 text-green-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {location}
                    </span>
                    {selected && (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-green-900" : "text-green-600"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
