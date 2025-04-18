import { LoadingPlaceholder } from '@/common/components/ui/LoadingPlaceholder'
import { LoginHeader } from '@/modules/auth/components/LoginHeader'

export default function Loading() {
  return (
    <LoginHeader>
      <LoadingPlaceholder />
    </LoginHeader>
  )
}
