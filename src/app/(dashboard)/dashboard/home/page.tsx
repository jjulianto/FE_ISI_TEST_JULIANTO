import Container from '@/common/components/ui/Container'
import Tasks from '@/modules/tasks/components/Tasks'

export default function Homepage() {
  return (
    <div className='min-h-screen p-8 bg-gray-100'>
      <Container>
        <Tasks />
      </Container>
    </div>
  )
}
