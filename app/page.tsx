import Destination from '@/components/Home/Destination/Destination'
import Home from '@/components/Home/Home'
import Hotel from '@/components/Home/Hotel/Hotel'
import WhyChoose from '@/components/Home/WhyChoose/WhyChoose'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      <Home />
      <Destination />
      <Hotel />
      <WhyChoose />
    </div>
  )
}

export default HomePage
