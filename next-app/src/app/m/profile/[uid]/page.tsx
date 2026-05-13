import ProfileDetailPage from '@/components/ProfileDetailPage/ProfileDetailPage'
export default function MobileProfileDetail({ params }: { params: { uid: string } }) {
  return <ProfileDetailPage uid={params.uid} desktop={false} />
}
