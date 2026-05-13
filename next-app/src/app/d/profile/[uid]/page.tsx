import ProfileDetailPage from '@/components/ProfileDetailPage/ProfileDetailPage'
export default function DesktopProfileDetail({ params }: { params: { uid: string } }) {
  return <ProfileDetailPage uid={params.uid} desktop={true} />
}
