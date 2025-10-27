
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

interface LogsProps {
	logsArray?: Log[]
}

export function Logs({ logsArray }: LogsProps) {
	const [logs, setLogs] = useState<Log[]>(logsArray || []);
	const [filter, setFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [autoScroll, setAutoScroll] = useState(true);
	const listRef = useRef<ListType>(null);


	const addNewLog = () => {
		const levels = ['info', 'success', 'warn', 'error'];
		const messages = [
			'Processing request...',
			'Connection established',
			'Memory usage: 45%',
			'Cache cleared',
			'Database query executed',
			'API response received',
			'Websocket connected',
			'File uploaded successfully'
		];

		const newLog = {
			event_id: Math.random().toString(36).slice(2, 12),
			report_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
			level: levels[Math.floor(Math.random() * levels.length)],
			message: messages[Math.floor(Math.random() * messages.length)],
			deployment_id: "", project_id: ""
		};

		setLogs(prev => [...prev, newLog]);
	};

	useEffect(() => {
		if (autoScroll && listRef.current && filteredLogs.length > 0) {
			listRef.current.scrollToRow(filteredLogs.length - 1);
		}
	}, [logs, autoScroll]);

	const filteredLogs = logs.filter(log => {
		const matchesFilter = filter === 'all' || log.level === filter;
		const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
			log.report_time.toLocaleString().includes(searchTerm);
		return matchesFilter && matchesSearch;
	});

	const getLevelColor = (level: string) => {
		switch (level) {
			case 'error': return 'text-red-400';
			case 'warn': return 'text-yellow-500';
			case 'success': return 'text-green-400';
			default: return 'text-gray-500';
		}
	};

	const downloadLogs = () => {
		const logText = logs.map(log =>
			`[${log.report_time}] [${log.level.toUpperCase()}] ${log.message}`
		).join('\n');

		const blob = new Blob([logText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `deployment-logs-${Date.now()}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const clearLogs = () => {
		setLogs([]);
	};

	const getFilterCount = (level: string) => {
		if (level === 'all') return logs.length;
		return logs.filter(log => log.level === level).length;
	};

	const rowRenderer = ({ index, key, style }: any) => { // FIX TYPE
		const log = filteredLogs[index];

		return (
			<div
				key={key}
				style={style}
				className="px-2 py-0.5 hover:bg-gray-900/50 border-b border-gray-900"
			>
				<div className="flex items-start gap-2 text-xs font-mono">
					<span className="text-gray-600 shrink-0">
						{log.report_time.toString()}
					</span>
					<span className={`${getLevelColor(log.level)} uppercase shrink-0 w-14`}>
						{log.level}
					</span>
					<span className="text-gray-300 flex-1 break-words leading-relaxed">
						{log.message}
					</span>
				</div>
			</div>
		);
	};

	return (
		<div className="bg-black text-gray-100 p-1 rounded-sm">
			<div className="max-w-7xl mx-auto">
				<div className="bg-gray-950 border border-gray-900">
					{/* Header */}
					<div className="border-b border-gray-900 px-3 py-2">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<GoTerminal className="w-4 h-4 text-gray-600" />
								<span className="text-sm font-medium text-gray-400">Console Logs</span>
							</div>
							<div className="flex gap-1">
								<button
									onClick={addNewLog}
									className="px-2 py-1 text-xs bg-gray-900 hover:bg-gray-800 text-gray-400 flex items-center gap-1"
									title="Add test log"
								>
									<LuRotateCw className="w-3 h-3" />
								</button>
								<button
									onClick={downloadLogs}
									className="px-2 py-1 text-xs bg-gray-900 hover:bg-gray-800 text-gray-400"
									title="Download"
								>
									<MdFileDownload className="w-3 h-3" />
								</button>
								<button
									onClick={clearLogs}
									className="px-2 py-1 text-xs bg-gray-900 hover:bg-gray-800 text-gray-400"
									title="Clear"
								>
									<GoTrash className="w-3 h-3" />
								</button>
							</div>
						</div>

						{/* Filters */}
						<div className="flex gap-2 items-center text-xs">
							<div className="flex gap-1">
								{['all', 'info', 'success', 'warn', 'error'].map(level => (
									<button
										key={level}
										onClick={() => setFilter(level)}
										className={`px-2 py-0.5 ${filter === level
											? 'bg-gray-800 text-gray-300'
											: 'bg-gray-900 text-gray-600 hover:text-gray-400'
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
										className="w-full h-6 pl-7 pr-2 py-0.5 bg-gray-900 border border-gray-800 text-xs text-gray-400 focus:outline-none focus:border-gray-700"
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

					{/* Virtualized Log Content */}
					<div className="bg-black" style={{ height: '420px' }}>
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
										overscanRowCount={10}
									/>
								)}
							</AutoSizer>
						)}
					</div>

					{/* Footer */}
					<div className="border-t border-gray-900 px-3 py-1 bg-gray-950">
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