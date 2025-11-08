import { JSX } from "react"
import { FaAngular, FaReact, FaVuejs } from "react-icons/fa"
import { SiSolid, SiSvelte, SiVite } from "react-icons/si"

const TechStack = ({ stack }: { stack: string }) => {
	const stacks: Record<string, JSX.Element> = {
		react: (<><div className='flex flex-col items-center justify-center w-2/5 bg-gradient-to-br from-[#20232a] to-[#282c34] rounded-xl border border-[#61dafb]/30 shadow-lg p-8'>
			<div className='mb-4 p-4 bg-[#61dafb]/10 rounded-2xl backdrop-blur-sm'>
				<FaReact className='size-16 text-[#61dafb]' />
			</div>
			<h4 className='text-2xl font-bold text-white mb-2'>React</h4>
			<p className='text-gray-400 text-sm'>JavaScript Library</p>
			<div className='mt-4 px-4 py-1.5 bg-[#61dafb]/10 rounded-full border border-[#61dafb]/30'>
				<p className='text-xs text-[#61dafb] font-medium'>v18.2.0</p>
			</div>
		</div></>),
		vite: (<><div className='flex flex-col items-center justify-center w-2/5 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-xl border border-[#646cff]/30 shadow-lg p-8'>
			<div className='mb-4 p-4 bg-gradient-to-br from-[#646cff]/10 to-[#747bff]/10 rounded-2xl backdrop-blur-sm'>
				<SiVite className='size-16 text-[#646cff]' />
			</div>
			<h4 className='text-2xl font-bold text-white mb-2'>Vite</h4>
			<p className='text-gray-400 text-sm'>Next Gen Build Tool</p>
			<div className='mt-4 px-4 py-1.5 bg-[#646cff]/10 rounded-full border border-[#646cff]/30'>
				<p className='text-xs text-[#646cff] font-medium'>v5.0.0</p>
			</div>
		</div></>),
		angular: (<><div className='flex flex-col items-center justify-center w-2/5 bg-gradient-to-br from-[#0d1117] to-[#1a1f2e] rounded-xl border border-[#dd0031]/30 shadow-lg p-8'>
			<div className='mb-4 p-4 bg-[#dd0031]/10 rounded-2xl backdrop-blur-sm'>
				<FaAngular className='size-16 text-[#dd0031]' />
			</div>
			<h4 className='text-2xl font-bold text-white mb-2'>Angular</h4>
			<p className='text-gray-400 text-sm'>Platform & Framework</p>
			<div className='mt-4 px-4 py-1.5 bg-[#dd0031]/10 rounded-full border border-[#dd0031]/30'>
				<p className='text-xs text-[#dd0031] font-medium'>v17.0.0</p>
			</div>
		</div></>),
		vuejs: (<><div className='flex flex-col items-center justify-center w-2/5 bg-gradient-to-br from-[#2c3e50] to-[#34495e] rounded-xl border border-[#42b883]/30 shadow-lg p-8'>
			<div className='mb-4 p-4 bg-[#42b883]/10 rounded-2xl backdrop-blur-sm'>
				<FaVuejs className='size-16 text-[#42b883]' />
			</div>
			<h4 className='text-2xl font-bold text-white mb-2'>Vue.js</h4>
			<p className='text-gray-400 text-sm'>Progressive Framework</p>
			<div className='mt-4 px-4 py-1.5 bg-[#42b883]/10 rounded-full border border-[#42b883]/30'>
				<p className='text-xs text-[#42b883] font-medium'>v3.4.0</p>
			</div>
		</div></>),

		solid: (<>
			<div className='flex flex-col items-center justify-center w-2/5 bg-gradient-to-br from-[#1a1d29] to-[#2a2f3f] rounded-xl border border-[#2c4f7c]/50 shadow-lg p-8'>
				<div className='mb-4 p-4 bg-[#2c4f7c]/20 rounded-2xl backdrop-blur-sm'>
					<SiSolid className='size-16 text-[#76b3e8]' />
				</div>
				<h4 className='text-2xl font-bold text-white mb-2'>Solid.js</h4>
				<p className='text-gray-400 text-sm'>Reactive Library</p>
				<div className='mt-4 px-4 py-1.5 bg-[#2c4f7c]/20 rounded-full border border-[#76b3e8]/30'>
					<p className='text-xs text-[#76b3e8] font-medium'>v1.8.0</p>
				</div>
			</div>
		</>),
		svelte: (<><div className='flex flex-col items-center justify-center w-2/5 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#ff3e00]/30 shadow-lg p-8'>
			<div className='mb-4 p-4 bg-[#ff3e00]/10 rounded-2xl backdrop-blur-sm'>
				<SiSvelte className='size-16 text-[#ff3e00]' />
			</div>
			<h4 className='text-2xl font-bold text-white mb-2'>Svelte</h4>
			<p className='text-gray-400 text-sm'>Cybernetically Enhanced</p>
			<div className='mt-4 px-4 py-1.5 bg-[#ff3e00]/10 rounded-full border border-[#ff3e00]/30'>
				<p className='text-xs text-[#ff3e00] font-medium'>v4.2.0</p>
			</div>
		</div></>),
	}

	return stacks[stack] || <div className='flex flex-col items-center justify-center w-2/5 bg-gradient-to-br from-[#1a1d29] to-[#2a2f3f] rounded-xl border border-[#2c4f7c]/50 shadow-lg p-8'>

	</div>
}
export default TechStack