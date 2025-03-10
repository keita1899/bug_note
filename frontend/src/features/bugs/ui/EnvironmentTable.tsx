import { Environment } from '../types/Environment'

export const EnvironmentTable = ({
  environments,
}: {
  environments: Environment[]
}) => {
  return (
    <div>
      <h3 className="pb-1 font-semibold">環境</h3>
      {environments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">カテゴリー</th>
                <th className="border px-4 py-2">名前</th>
                <th className="border px-4 py-2">バージョン</th>
              </tr>
            </thead>
            <tbody>
              {environments.map((env, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">{env.category}</td>
                  <td className="border px-4 py-2">{env.name}</td>
                  <td className="border px-4 py-2">{env.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
