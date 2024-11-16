import { SPECIAL_CHARACTERS_GROUPS, SPECIAL_CHARACTERS_HEADINGS } from '../const/special-chars';

const SpecialCharacters = () => {
  return (
    <section>
      <div className="grid gap-4">
        {SPECIAL_CHARACTERS_GROUPS.map((value, i) => {
          const rows = Math.ceil(value.length / SPECIAL_CHARACTERS_HEADINGS.length);
          return (
            <div key={i} className="relative grid overflow-x-auto">
              <table className="w-fit text-center text-sm text-gray-400">
                <thead>
                  <tr className="bg-orange-400 text-xs uppercase text-gray-950">
                    {SPECIAL_CHARACTERS_HEADINGS.map((heading, j) => {
                      return (
                        <th key={j} className="px-2 py-1">
                          {heading}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: rows }, (_, k) => {
                    return (
                      <tr key={k} className='class="dark:border-gray-700" border-b odd:bg-gray-900 even:bg-gray-800'>
                        {Array.from({ length: SPECIAL_CHARACTERS_HEADINGS.length }, (_, l) => {
                          return (
                            <td key={l} className="px-2 py-1">
                              {value[k * SPECIAL_CHARACTERS_HEADINGS.length + l]}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default SpecialCharacters;
