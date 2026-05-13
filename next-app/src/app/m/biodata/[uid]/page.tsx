import BiodataPage from '@/components/BiodataPage/BiodataPage'
export default function MobileBiodata({ params }: { params: { uid: string } }) {
  return <BiodataPage uid={params.uid} desktop={false} />
}
