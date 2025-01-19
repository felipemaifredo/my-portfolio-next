
//Sections
import { Hero } from "@/ui/sections/Hero"
import { About } from "@/ui/sections/About"
import { ProjectsSectionHome } from "@/ui/sections/ProjectsSectionHome"
import { Contact } from "../sections/Contact"

export const Home = () => {
    return (<>
        <Hero />
        <About />
        <ProjectsSectionHome />
        <Contact />
    </>)
}
