export const NoData = ({
  message = 'データがありません',
}: {
  message?: string
}) => (
  <div className="p-4 pt-32 text-center">
    <p className="text-lg font-semibold text-gray-600">{message}</p>
  </div>
)
