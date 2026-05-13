import BiodataPage from '@/components/BiodataPage/BiodataPage'
export default function DesktopBiodata({ params }: { params: { uid: string } }) {
  return <BiodataPage uid={params.uid} desktop={true} />
}
