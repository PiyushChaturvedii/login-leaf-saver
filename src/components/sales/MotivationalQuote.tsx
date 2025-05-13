
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const quotes = [
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only place where success comes before work is in the dictionary.",
    author: "Vidal Sassoon"
  },
  {
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill"
  },
  {
    text: "We believe in rewarding contribution, not just holidays.",
    author: "Company Motto"
  },
  {
    text: "Your attitude, not your aptitude, will determine your altitude.",
    author: "Zig Ziglar"
  },
  {
    text: "Sales are contingent upon the attitude of the salesperson, not the attitude of the prospect.",
    author: "W. Clement Stone"
  }
];

export const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Change quote every 15 seconds
    const interval = setInterval(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-100">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <p className="text-lg italic text-green-800 font-medium mb-4">
            "{quote.text}"
          </p>
          <p className="text-green-600">— {quote.author}</p>
        </div>
      </CardContent>
    </Card>
  );
};
