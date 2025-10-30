import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
const ProjectTabs = () => {
	return (

		<TabsList className="flex border-b border-neutral-300 dark:border-neutral-800 mb-4 bg-background">
			{["project", "deployments", "analytics", "settings"].map(tab => (
				<TabsTrigger
					key={tab}
					value={tab}
					className="
        relative px-4 py-2 text-sm font-medium
        text-neutral-700 dark:text-neutral-300
        data-[state=active]:text-primary
        after:content-['']
        after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px]
        after:bg-transparent
        data-[state=active]:after:bg-primary
        transition-all
      "
				>
					{tab[0].toUpperCase() + tab.slice(1)}
				</TabsTrigger>
			))}
		</TabsList>



	)
}
export default ProjectTabs