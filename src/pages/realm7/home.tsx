import React from 'react';
import { useLocation, Link } from 'wouter';
import { ChevronRight, Award, Sparkles, BookOpen, Star, ChevronLeft, User, Map } from 'lucide-react';
import { realm7Missions } from '../../lib/realm7-missions'; // Missions for The Summit of Knowledge (Realm 7)
import { navigate } from '../../lib/router';

export default function Realm7Home() {
  const [_, setLocation] = useLocation();
  
  const description = (
    <div className="space-y-4">
      <p>
        Welcome to Realm 7: The Summit of Knowledge, the culmination of your Bitcoin journey with Asha. 
        Here, you'll consolidate everything you've learned throughout all previous realms and demonstrate your mastery.
      </p>
      <p>
        This realm features comprehensive reviews, practical challenges, technical tests, and a final challenge 
        that brings together all aspects of your Bitcoin education. Upon completion, you'll earn your certification 
        as a Bitcoin journeyer.
      </p>
      <p>
        Are you ready for the final ascent to Bitcoin mastery?
      </p>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/home">
              <a className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                <ChevronLeft className="mr-2 h-5 w-5" />
                <span>Return to Home</span>
              </a>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <a className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <User className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors" />
                </a>
              </Link>
              <Link href="/badges">
                <a className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <Award className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors" />
                </a>
              </Link>
              <Link href="/map">
                <a className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <Map className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-block mb-6">
            <Sparkles className="w-20 h-20 text-purple-400" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 mb-4">
            Realm 7: The Summit of Knowledge
          </h1>
          
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            The culmination of your Bitcoin journey - where mastery meets certification.
          </p>
        </div>
        
        {/* Realm Description */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-purple-500 mb-4">The Summit of Knowledge</h2>
          <div className="text-gray-300 bg-gray-900 border border-gray-800 rounded-lg p-6">
            {description}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Journey Summary Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-start mb-4">
              <div className="bg-purple-900/30 p-3 rounded-lg mr-4">
                <BookOpen className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-purple-400">Your Bitcoin Journey</h2>
                <p className="text-gray-400 mt-1">From the foundations of money to the heights of Bitcoin mastery</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-300">
                <div className="bg-emerald-900/30 p-1 rounded-full mr-3">
                  <Star className="h-4 w-4 text-emerald-400" />
                </div>
                <span>Realm 1: Winds of Trade - Foundations of Money</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="bg-emerald-900/30 p-1 rounded-full mr-3">
                  <Star className="h-4 w-4 text-emerald-400" />
                </div>
                <span>Realm 2: Watching Walls - Digital Surveillance</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="bg-emerald-900/30 p-1 rounded-full mr-3">
                  <Star className="h-4 w-4 text-emerald-400" />
                </div>
                <span>Realm 3: Spark Beneath Stone - Bitcoin's Birth</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="bg-emerald-900/30 p-1 rounded-full mr-3">
                  <Star className="h-4 w-4 text-emerald-400" />
                </div>
                <span>Realm 4: Fire Beneath Ledger - Mining and Consensus</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="bg-emerald-900/30 p-1 rounded-full mr-3">
                  <Star className="h-4 w-4 text-emerald-400" />
                </div>
                <span>Realm 5: Code Council - Bitcoin Governance</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="bg-emerald-900/30 p-1 rounded-full mr-3">
                  <Star className="h-4 w-4 text-emerald-400" />
                </div>
                <span>Realm 6: Circle of Trust - Bitcoin in Africa</span>
              </div>
              <div className="flex items-center text-purple-300 font-semibold">
                <div className="bg-purple-900/30 p-1 rounded-full mr-3">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <span>Realm 7: Summit of Knowledge - Mastery and Certification</span>
              </div>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm">
                You've traveled through six realms of Bitcoin knowledge with Asha as your guide. 
                Now it's time to bring everything together and demonstrate your complete understanding 
                of Bitcoin's technology, economy, and transformative potential for Africa and the world.
              </p>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => navigate('/realm7/missions', setLocation)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg font-semibold"
              >
                Begin Final Challenges 
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Additional Info Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-start mb-4">
              <div className="bg-yellow-900/30 p-3 rounded-lg mr-4">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400">Certification Awaits</h3>
                <p className="text-gray-400 mt-1">Complete all challenges to earn your Bitcoin mastery certificate</p>
              </div>
            </div>
            
            <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                Upon successful completion of Realm 7, you'll receive a digital certificate 
                recognizing your journey through all seven realms and your comprehensive 
                understanding of Bitcoin's role in creating financial sovereignty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}