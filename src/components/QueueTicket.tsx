import React from 'react';
import { User, Crown, Heart, MapPin, Clock, Calendar, TrendingUp, ExternalLink } from 'lucide-react';

interface TicketData {
    tokenNumber: string;
    name: string;
    customerType: string;
    phone: string;
    email: string;
    position: number;
    joinedAt: string;
    estimatedWait: string;
    statusLink: string;
}

interface QueueTicketProps {
    data: TicketData;
}

const QueueTicket: React.FC<QueueTicketProps> = ({ data }) => {
    const getTypeIcon = () => {
        switch (data.customerType.toLowerCase()) {
            case 'vip':
                return <Crown className="w-5 h-5 text-yellow-400" />;
            case 'senior':
                return <Heart className="w-5 h-5 text-red-400" />;
            default:
                return <User className="w-5 h-5 text-blue-400" />;
        }
    };

    const getTypeColor = () => {
        switch (data.customerType.toLowerCase()) {
            case 'vip':
                return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
            case 'senior':
                return 'from-red-500/20 to-red-600/20 border-red-500/30';
            default:
                return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
        }
    };

    return (
        <div id="queue-ticket" className="w-full max-w-2xl mx-auto bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 rounded-3xl overflow-hidden shadow-2xl border border-primary-500/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white text-center tracking-wider font-poppins">
                        QYRA SERVICE TICKET
                    </h1>
                    <p className="text-primary-100 text-center text-sm mt-1">Digital Queue Management System</p>
                </div>
            </div>

            {/* Perforation Line */}
            <div className="relative h-8 bg-dark-900">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full border-t-2 border-dashed border-primary-500/30"></div>
                </div>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-950 rounded-full"></div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-950 rounded-full"></div>
            </div>

            {/* Token Number - Prominent Display */}
            <div className="px-8 py-8 bg-gradient-to-br from-primary-600/20 via-primary-500/10 to-transparent">
                <div className="text-center">
                    <p className="text-primary-300 text-sm font-medium mb-2 tracking-wide">YOUR TOKEN NUMBER</p>
                    <div className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 px-12 py-6 rounded-2xl shadow-lg shadow-primary-500/30 border border-primary-400/30">
                        <h1 className="text-6xl font-bold text-white tracking-wider" style={{ margin: 0, padding: 0, fontFamily: 'monospace', color: 'white' }}>
                            {data.tokenNumber}
                        </h1>
                    </div>
                    <p className="text-dark-400 text-xs mt-3">Keep this number for reference</p>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="px-8 py-6 grid md:grid-cols-2 gap-6">
                {/* Left Column - Customer Details */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-white font-poppins">Customer Details</h2>
                    </div>

                    {/* Name */}
                    <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
                        <p className="text-dark-400 text-xs mb-1 flex items-center gap-1">
                            <User className="w-3 h-3" /> Name
                        </p>
                        <p className="text-white font-semibold text-lg">{data.name}</p>
                    </div>

                    {/* Type */}
                    <div className={`bg-gradient-to-br ${getTypeColor()} rounded-xl p-4 border`}>
                        <p className="text-dark-400 text-xs mb-1">Customer Type</p>
                        <div className="flex items-center gap-2">
                            {getTypeIcon()}
                            <p className="text-white font-semibold text-lg uppercase">{data.customerType}</p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
                        <p className="text-dark-400 text-xs mb-1">Phone Number</p>
                        <p className="text-white font-medium">{data.phone}</p>
                    </div>

                    {/* Email */}
                    <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
                        <p className="text-dark-400 text-xs mb-1">Email Address</p>
                        <p className="text-white font-medium break-all text-sm">{data.email}</p>
                    </div>
                </div>

                {/* Right Column - Queue Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-white font-poppins">Queue Information</h2>
                    </div>

                    {/* Current Position */}
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
                        <p className="text-blue-300 text-xs mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Current Position
                        </p>
                        <p className="text-white font-bold text-3xl">#{data.position}</p>
                    </div>

                    {/* Joined At */}
                    <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
                        <p className="text-dark-400 text-xs mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Joined At
                        </p>
                        <p className="text-white font-semibold">{data.joinedAt}</p>
                    </div>

                    {/* Average Service Time */}
                    <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
                        <p className="text-dark-400 text-xs mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Average Service Time
                        </p>
                        <p className="text-white font-semibold">10 minutes</p>
                    </div>

                    {/* Estimated Wait */}
                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
                        <p className="text-yellow-300 text-xs mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Estimated Wait
                        </p>
                        <p className="text-white font-bold text-2xl">{data.estimatedWait}</p>
                    </div>
                </div>
            </div>

            {/* Footer - Status Link */}
            <div className="px-8 py-6 bg-dark-900/50 border-t border-dark-700/50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-dark-400 text-xs mb-1">Track Your Status Online</p>
                        <a
                            href={data.statusLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                            {data.statusLink}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                    <div className="text-right">
                        <p className="text-dark-500 text-xs">Powered by</p>
                        <p className="text-primary-400 font-bold text-lg font-poppins">QYRA</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueueTicket;
