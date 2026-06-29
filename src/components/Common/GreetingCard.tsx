'use client';
import { type FC, useEffect, useState } from 'react';
import { Moon, Sun, Sunrise, Sunset } from 'lucide-react';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

const GreetingCard: FC = () => {
  // Timezone
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');

  // Function to determine time of day and set appropriate greeting and icon
  const updateTimeOfDay = (hour: number) => {
    if (hour >= 4 && hour < 12) {
      setGreeting('SELAMAT PAGI');
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 15) {
      setGreeting('SELAMAT SIANG');
      setTimeOfDay('afternoon');
    } else if (hour >= 15 && hour < 18) {
      setGreeting('SELAMAT SORE');
      setTimeOfDay('evening');
    } else {
      setGreeting('SELAMAT MALAM');
      setTimeOfDay('night');
    }
  };

  useEffect(() => {
    // Set the initial time when the component mounts on the client
    setCurrentTime(new Date().toLocaleString());
    updateTimeOfDay(new Date().getHours());

    // Optional: Update the time periodically
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
      updateTimeOfDay(new Date().getHours());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const getGreetingIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sunrise className="w-6 h-6 sm:w-8 sm:h-8 text-[#F9D923] dark:text-white" />;
      case 'afternoon':
        return <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-[#F08700] dark:text-white" />;
      case 'evening':
        return <Sunset className="w-6 h-6 sm:w-8 sm:h-8 text-[#EB6440] dark:text-white" />;
      case 'night':
        return <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-[#36455A] dark:text-white" />;
    }
  };

  const getBackgroundColor = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-[#FFEFD6]/30 dark:bg-[#6B4226]/30'; // warm brown for morning
      case 'afternoon':
        return 'bg-[#F9F54B]/20 dark:bg-[#B59E0D]/30'; // golden mustard for afternoon
      case 'evening':
        return 'bg-[#FFC3C3]/30 dark:bg-[#872626]/30'; // soft deep red for evening
      case 'night':
        return 'bg-[#8294C4]/20 dark:bg-[#2C3E50]/30'; // muted deep blue for night
    }
  };

  return (
    <div
      className={`w-full bg-white dark:bg-sidebar rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}
    >
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white">
          {greeting}!
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
          Terimakasih sudah mengelola semua data dengan baik. Kamu sangat luar biasa!
        </p>
        {currentTime && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Sekarang Pukul: {currentTime}
          </p>
        )}
      </div>
      <div className={`${getBackgroundColor()} p-3 sm:p-4 rounded-lg self-end sm:self-auto`}>
        {getGreetingIcon()}
      </div>
    </div>
  );
};

export default GreetingCard;
