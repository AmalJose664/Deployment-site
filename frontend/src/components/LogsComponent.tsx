
import { List, AutoSizer } from 'react-virtualized';
import type { List as ListType } from 'react-virtualized';
import { Log } from "@/types/Log";
import { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';

import { GoTerminal } from "react-icons/go";
import { MdFileDownload } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { LuRotateCw } from "react-icons/lu";
import { ansiConverter } from '@/lib/ansiToHtml';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addLogs, clearLogs } from '@/store/slices/logSlice';
import { formatLogTime, getLevelColor } from '@/lib/utils';
import { useGetDeploymentLogsQuery } from '@/store/services/logsApi';

interface LogsProps {
	logsArray?: Log[]
}

export function Logs({ deploymentId }: { deploymentId: string }) {
	const dispatch = useDispatch()

	const logs = useSelector((state: RootState) => state.logs)


	const [filter, setFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [autoScroll, setAutoScroll] = useState(true);
	const listRef = useRef<ListType>(null);

	useEffect(() => {
		if (autoScroll && listRef.current && filteredLogs.length > 0) {
			listRef.current.scrollToRow(filteredLogs.length - 1);
		}
	}, [logs, autoScroll]);

	const [logss, setLogs] = useState([])


	const filteredLogs = (logss.length ? logss : logs).filter(log => {

		if (!log) return false
		const matchesFilter = filter === 'all' || log.level === filter;
		const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
			new Date(log.timestamp).toLocaleString().includes(searchTerm);
		return matchesFilter && matchesSearch;
	});



	const downloadLogs = () => {
		const logText = logs.map(log =>
			`[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`
		).join('\n');

		const blob = new Blob([logText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `deployment-logs-${Date.now()}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const clearLog = () => {
		dispatch(clearLogs())
	};


	const getFilterCount = (level: string) => {
		if (level === 'all') return logs.length;
		return logs.filter(log => log.level === level).length;
	};

	const rowRenderer = ({ index, key, style }: any) => { // FIX TYPE
		const log = filteredLogs[index];
		const htmlMessage = ansiConverter.toHtml(log.message);
		return (
			<div
				key={key}
				style={style}
				className="px-2 py-0.5 dark:hover:bg-neutral-800 hover:bg-neutral-300    active:bg-blue-950"
			>
				<div className="flex items-start gap-2 dark:text-xs text-sm font-mono">
					<span className="text-primary shrink-0 mt-[2px]">
						{formatLogTime(log.timestamp)}
					</span>
					<span className={`${getLevelColor(log.level)} uppercase shrink-0 w-16 mt-[2px]`}>
						{log.level}
					</span>
					<span className="dark:text-neutral-200 text-gray-900   flex-1 break-words leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis "
						dangerouslySetInnerHTML={{ __html: htmlMessage }}>
						{/* {log.message} */}
					</span>
				</div>
			</div>
		);
	};

	return (
		<div className="dark:bg-neutral-950 bg-gray-50 text-gray-100 p-1 rounded-md">
			<div className="max-w-full mx-auto">
				<div className="dark:bg-neutral-950 bg-gray-50 border ">
					{/* Header */}
					<div className="border-b  px-3 py-2">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<GoTerminal className="w-4 h-4 text-gray-600" />
								<span className="text-sm font-medium text-gray-400">Logs</span>
							</div>
							<div className="flex gap-1">
								<button
									className="px-2 py-1 text-xs dark:bg-gray-900  dark:hover:bg-gray-800 hover:bg-gray-200 text-less  flex items-center gap-1"
									title="Add test log"
								>
									<LuRotateCw className="w-3 h-3" />
								</button>
								<button
									onClick={downloadLogs}
									className="px-2 py-1 text-xs dark:bg-gray-900  dark:hover:bg-gray-800 hover:bg-gray-200 text-less "
									title="Download"
								>
									<MdFileDownload className="w-3 h-3" />
								</button>
								<button
									onClick={clearLog}
									className="px-2 py-1 text-xs dark:bg-gray-900  dark:hover:bg-gray-800 hover:bg-gray-200 text-less "
									title="Clear"
								>
									<GoTrash className="w-3 h-3" />
								</button>
							</div>
						</div>

						{/* Filters */}
						<div className="flex gap-2 items-center text-xs">
							<div className="flex gap-1">
								{['all', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map(level => (
									<button
										key={level}
										onClick={() => setFilter(level)}
										className={`px-2 py-0.5 ${filter === level
											? 'dark:bg-neutral-800 border dark:border-neutral-100 border-neutral-900 bg-gray-400 rounded-sm text-some-less'
											: 'dark:bg-neutral-900 bg-gray-100 text-gray-600 hover:text-gray-900 dark:hover:text-gray-300'
											}`}
									>
										{level} ({getFilterCount(level)})
									</button>
								))}
							</div>

							<div className="flex-1 min-w-48">
								<div className="relative">
									<IoSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-600" />
									<Input
										type="text"
										placeholder="Search..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full h-6 pl-7 pr-2 py-0.5  border border-gray-400 dark:border-gray-800 text-xs text-gray-400 focus:outline-none focus:border-gray-700"
									/>
								</div>
							</div>

							<label className="flex items-center gap-1 text-gray-600 cursor-pointer">
								<input
									type="checkbox"
									checked={autoScroll}
									onChange={(e) => setAutoScroll(e.target.checked)}
									className="w-3 h-3"
								/>
								<span>auto</span>
							</label>
						</div>
					</div>

					<div className="dark:bg-neutral-950 bg-white logs-container-build " style={{ height: '420px' }}>
						{filteredLogs.length === 0 ? (
							<div className="flex items-center justify-center h-full text-gray-700">
								<div className="text-center text-xs">
									<GoTerminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
									<p>No logs</p>
								</div>
							</div>
						) : (
							<AutoSizer>
								{({ height, width }: { height: number, width: number }) => (
									<List
										ref={listRef}
										width={width}
										height={height}
										rowCount={filteredLogs.length}
										rowHeight={24}
										rowRenderer={rowRenderer}
										overscanRowCount={10} className='logs-container-build'
									/>
								)}
							</AutoSizer>
						)}
					</div>

					{/* Footer */}
					<div className="border-t  px-3 py-1 dark:bg-neutral-950 bg-white">
						<div className="flex justify-between text-xs text-gray-700">
							<span>{filteredLogs.length} / {logs.length}</span>
							<span>virtualized</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}