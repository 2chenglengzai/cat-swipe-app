import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const CAT_COUNT = 15;
const SWIPE_THRESHOLD = 100;

const CatSwipeApp = () => {
  const [cats, setCats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate unique cat image URLs
  useEffect(() => {
    const catImages = Array.from({ length: CAT_COUNT }, (_, i) => ({
      id: i,
      url: `https://cataas.com/cat?${i}&width=400&height=500`,
    }));
    setCats(catImages);
    setIsLoading(false);
  }, []);

  const handleSwipe = (direction) => {
    const currentCat = cats[currentIndex];
    
    if (direction === 'right') {
      setLikedCats([...likedCats, currentCat]);
    }

    if (currentIndex === cats.length - 1) {
      setShowResults(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const resetApp = () => {
    setCurrentIndex(0);
    setLikedCats([]);
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐱</div>
          <div className="text-xl font-semibold text-gray-700">Loading adorable cats...</div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Results! 🎉</h1>
            <p className="text-xl text-gray-600">
              You liked <span className="font-bold text-pink-600">{likedCats.length}</span> out of {cats.length} cats
            </p>
          </div>

          {likedCats.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😿</div>
              <p className="text-xl text-gray-600 mb-6">No cats liked? Maybe you're more of a dog person!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {likedCats.map((cat) => (
                <div key={cat.id} className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src={cat.url}
                    alt={`Liked cat ${cat.id}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-2">
                    ❤️
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={resetApp}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Try Again! 🐾
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Paws & Preferences 🐱
        </h1>
        <p className="text-gray-600">Swipe right to like, left to pass</p>
        <div className="mt-2 text-sm text-gray-500">
          {currentIndex + 1} / {cats.length}
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="relative w-full max-w-sm h-[500px]">
          {cats.map((cat, index) => {
            if (index < currentIndex) return null;
            
            return (
              <SwipeCard
                key={cat.id}
                cat={cat}
                isTop={index === currentIndex}
                onSwipe={handleSwipe}
                style={{
                  zIndex: cats.length - index,
                  scale: index === currentIndex ? 1 : 0.95,
                  opacity: index === currentIndex ? 1 : 0.5,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pb-8 px-4">
        <div className="max-w-sm mx-auto flex justify-center gap-6">
          <button
            onClick={() => handleSwipe('left')}
            className="bg-white text-red-500 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all flex items-center justify-center text-3xl"
          >
            ✕
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="bg-white text-green-500 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all flex items-center justify-center text-3xl"
          >
            ❤
          </button>
        </div>
      </div>
    </div>
  );
};

const SwipeCard = ({ cat, isTop, onSwipe, style }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    if (!isTop) return;

    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity,
        ...style,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{
        scale: style.scale,
        opacity: style.opacity,
      }}
      transition={{
        scale: { duration: 0.2 },
        opacity: { duration: 0.2 },
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full">
        <div className="relative h-full">
          <img
            src={cat.url}
            alt={`Cat ${cat.id}`}
            className="w-full h-full object-cover"
            draggable="false"
          />
          
          {/* Swipe indicators */}
          <motion.div
            className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-2xl transform -rotate-12 border-4 border-white"
            style={{
              opacity: useTransform(x, [-100, 0], [1, 0]),
            }}
          >
            NOPE
          </motion.div>
          
          <motion.div
            className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-2xl transform rotate-12 border-4 border-white"
            style={{
              opacity: useTransform(x, [0, 100], [0, 1]),
            }}
          >
            LIKE
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CatSwipeApp;