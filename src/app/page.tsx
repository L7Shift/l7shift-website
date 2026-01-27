import { DeviceSwitch } from '@/components/DeviceSwitch'

// This is now a SERVER component - content is SSR'd for SEO
// The DeviceSwitch client component handles device-specific rendering
export default function Home() {
  return <DeviceSwitch />
}
