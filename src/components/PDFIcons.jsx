import { PDFIcon } from '@/assets';

export default function PDFIcons() {
    return (
        <div className="bg-white p-8 rounded-lg w-full h-[69vh]">
            <div className="flex space-x-6">
                {/* Medical PDF */}
                <div className="flex flex-col items-center">
                    <div className="text-red-500 mb-1">
                        <img src={PDFIcon} />
                    </div>
                    <span className="text-gray-700 text-sm">Medical</span>
                </div>

                {/* License PDF */}
                <div className="flex flex-col items-center">
                    <div className="text-red-500 mb-1">
                        <img src={PDFIcon} />
                    </div>
                    <span className="text-gray-700 text-sm">License</span>
                </div>
            </div>
        </div>
    );
}