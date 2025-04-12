import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

export const useNotificationRead = () => {
  const queryClient = useQueryClient()

  const { mutate: markAsRead, isPending: isUpdating } = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await axios.patch(
        API_URLS.MYPAGE.NOTIFICATIONS.UPDATE(notificationId),
        {},
        {
          headers: getAuthHeaders() ?? {},
        },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const handleNotificationRead = (notificationId: string) => {
    if (!isUpdating) {
      markAsRead(notificationId)
    }
  }

  return {
    markAsRead: handleNotificationRead,
    isUpdating,
  }
}
