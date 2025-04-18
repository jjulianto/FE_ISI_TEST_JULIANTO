export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full w-full container mx-auto px-5 md:px-15 2xl:px-[140px]'>
      {children}
    </div>
  )
}
