"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {SideBarOptions} from "@/services/constants"
import { usePathname } from "next/navigation";


export function AppSidebar() {
     
    const path= usePathname();
    console.log(path);
  return (
    <Sidebar>
      <SidebarHeader className='flex items-center mt-5'>
        <Image 
          src={'/logo.png'} 
          alt="logo" 
          width={120}
          height={50} 
          className="w-[70px]" 
        />
        <Link href="/dashboard/create-interview"> 
        <Button className='w-full mt-5'>
          <Plus /> Create New Interview
        </Button></Link>
       
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild className={`${path==option.path && 'text-primary'}`}>
                  <Link href={option.path}>
                    <option.icon  className={`${path==option.path && 'text-primary'}`}/>
                    <span className={`font-20 ${path==option.path && 'text-primary'} `}>{option.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
