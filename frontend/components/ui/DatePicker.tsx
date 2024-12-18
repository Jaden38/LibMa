import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    label: string;
    placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, placeholder = "Sélectionner une date" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const calendarRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const [openDirection, setOpenDirection] = useState<'up' | 'down'>('down');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)
                && inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen && inputRef.current) {

            const rect = inputRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const neededSpace = 300;
            if (spaceBelow < neededSpace) {
                setOpenDirection('up');
            } else {
                setOpenDirection('down');
            }
        }
        setIsOpen(!isOpen);
    };

    const getDaysInMonth = (date: Date) => {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const days: Date[] = [];


        for (let i = 0; i < firstDayOfMonth; i++) {
            const prevMonthDay = new Date(date.getFullYear(), date.getMonth(), -i);
            days.unshift(prevMonthDay);
        }


        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(date.getFullYear(), date.getMonth(), i));
        }


        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
        }

        return days;
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    const dropdownVariants = {
        initial: { opacity: 0, y: openDirection === 'down' ? 10 : -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: openDirection === 'down' ? 10 : -10 },
    };

    return (
        <div className="relative">
            <label className="block mb-1 font-semibold text-white">
                {label}
            </label>
            <div
                ref={inputRef}
                onClick={handleToggle}
                className="w-full p-2 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded cursor-pointer flex items-center justify-between hover:border-[#00f1a1] transition-colors"
            >
                <span className={value ? 'text-white' : 'text-gray-400'}>
                    {value ? new Date(value).toLocaleDateString('fr-FR') : placeholder}
                </span>
                <Calendar size={16} className="text-[#00f1a1]" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={calendarRef}
                        variants={dropdownVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`absolute z-50 p-4 bg-[#1a1a1a] border border-[#2c2c2c] rounded-lg shadow-xl w-72 ${openDirection === 'down' ? 'mt-2' : 'mb-2 bottom-full'
                            }`}
                        style={{ [openDirection === 'down' ? 'top' : 'bottom']: '100%' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
                                }}
                                className="p-1 hover:bg-[#2c2c2c] rounded-full transition-colors"
                            >
                                <ChevronLeft size={20} className="text-[#00f1a1]" />
                            </button>
                            <h3 className="text-white font-medium">
                                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
                                }}
                                className="p-1 hover:bg-[#2c2c2c] rounded-full transition-colors"
                            >
                                <ChevronRight size={20} className="text-[#00f1a1]" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-400 py-1">
                                    {day}
                                </div>
                            ))}

                            {getDaysInMonth(currentDate).map((date, index) => {
                                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                const isSelected = value === formatDate(date);
                                const isToday = formatDate(date) === formatDate(new Date());

                                return (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange(formatDate(date));
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            p-1 text-sm rounded-full transition-all
                                            ${isCurrentMonth ? 'text-white' : 'text-gray-600'}
                                            ${isSelected ? 'bg-[#00f1a1] text-black font-medium' : 'hover:bg-[#2c2c2c]'}
                                            ${isToday && !isSelected ? 'border border-[#00f1a1]' : ''}
                                        `}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DatePicker;
