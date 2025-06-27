"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { 
  SearchIcon,
  FilterIcon,
  StarIcon,
  MessageSquareIcon,
  UsersIcon,
  TrendingUpIcon,
  ExternalLinkIcon,
  BotIcon,
  SparklesIcon,
  ArrowLeftIcon,
  PlusIcon,
  ArrowUpCircleIcon
} from "lucide-react"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import type { Database } from '@/lib/supabase'

type Project = Database['public']['Tables']['projects']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface ProjectWithProfile extends Project {
  profiles?: Profile
}

const categories = [
  "All Categories",
  "Business",
  "Education",
  "Entertainment",
  "Health",
  "Technology",
  "Creative",
  "Other"
]

const filterTabs = [
  { name: "Featured", active: true },
  { name: "Trending", active: false },
  { name: "Most Popular", active: false },
  { name: "Recently Added", active: false },
  { name: "Top Rated", active: false }
]

// Project preview images - using Pexels for stock photos
const projectImages = [
  "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
]

export default function ChatPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [activeFilter, setActiveFilter] = useState("Featured")
  const [projects, setProjects] = useState<ProjectWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'discover' | 'create'>('discover')

  useEffect(() => {
    const fetchPublicProjects = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch only public projects with their creator profiles
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select(`
            *,
            profiles (
              id,
              email,
              full_name,
              avatar_url
            )
          `)
          .eq('is_public', true)
          .order('created_at', { ascending: false })

        if (fetchError) {
          throw fetchError
        }

        setProjects(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects')
      } finally {
        setLoading(false)
      }
    }

    if (currentView === 'discover') {
      fetchPublicProjects()
    }
  }, [currentView])

  // Helper function to get category from project description or plan
  const getProjectCategory = (project: Project) => {
    const description = project.description.toLowerCase()
    const name = project.name.toLowerCase()
    
    if (description.includes('business') || description.includes('enterprise') || name.includes('business')) return 'Business'
    if (description.includes('education') || description.includes('learn') || name.includes('education')) return 'Education'
    if (description.includes('health') || description.includes('wellness') || name.includes('health')) return 'Health'
    if (description.includes('creative') || description.includes('art') || name.includes('creative')) return 'Creative'
    if (description.includes('tech') || description.includes('api') || name.includes('tech')) return 'Technology'
    if (description.includes('game') || description.includes('fun') || name.includes('entertainment')) return 'Entertainment'
    
    return 'Other'
  }

  // Helper function to generate avatar emoji based on category
  const getProjectAvatar = (project: Project) => {
    const category = getProjectCategory(project)
    const avatars = {
      'Business': '💼',
      'Education': '📚',
      'Health': '🏥',
      'Creative': '🎨',
      'Technology': '💻',
      'Entertainment': '🎮',
      'Other': '🤖'
    }
    return avatars[category as keyof typeof avatars] || '🤖'
  }

  // Helper function to get color based on category
  const getProjectColor = (project: Project) => {
    const category = getProjectCategory(project)
    const colors = {
      'Business': 'bg-blue-500',
      'Education': 'bg-purple-500',
      'Health': 'bg-green-500',
      'Creative': 'bg-pink-500',
      'Technology': 'bg-indigo-500',
      'Entertainment': 'bg-orange-500',
      'Other': 'bg-gray-500'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-500'
  }

  const filteredBots = React.useMemo(() => {
    if (loading || !projects.length) return []
    
    let projectsToFilter = projects.map((project, index) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      creator: project.profiles?.full_name || project.profiles?.email?.split('@')[0] || 'Anonymous',
      authorAvatar: getProjectAvatar(project),
      category: getProjectCategory(project),
      rating: 4.0 + Math.random() * 1, // Random rating between 4.0-5.0
      conversations: Math.floor(Math.random() * 10000) + 1000,
      users: Math.floor(Math.random() * 2000) + 100,
      tags: [getProjectCategory(project), project.plan.charAt(0).toUpperCase() + project.plan.slice(1)],
      featured: index < 3, // First 3 projects are featured
      trending: Math.random() > 0.7, // 30% chance of being trending
      slug: project.custom_slug || project.slug,
      isPro: project.plan !== 'personal',
      preview: {
        imageUrl: projectImages[index % projectImages.length],
        textColor: "text-white",
        content: getProjectAvatar(project)
      }
    }))

    // Apply filter
    if (activeFilter === "Featured") {
      projectsToFilter = projectsToFilter.filter(project => project.featured)
    } else if (activeFilter === "Trending") {
      projectsToFilter = projectsToFilter.filter(project => project.trending)
    } else if (activeFilter === "Most Popular") {
      projectsToFilter = [...projectsToFilter].sort((a, b) => b.users - a.users)
    } else if (activeFilter === "Top Rated") {
      projectsToFilter = [...projectsToFilter].sort((a, b) => b.rating - a.rating)
    }

    // Apply category filter
    if (selectedCategory !== "All Categories") {
      projectsToFilter = projectsToFilter.filter(project => project.category === selectedCategory)
    }

    // Apply search filter
    if (searchTerm) {
      projectsToFilter = projectsToFilter.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return projectsToFilter
  }, [searchTerm, selectedCategory, activeFilter, projects, loading])

  const handleProjectClick = (project: typeof filteredBots[0]) => {
    // Navigate to individual chat with this project
    window.location.href = `/chat/${project.slug}`
  }

  const handleBackToAdmin = () => {
    window.location.href = '/admin'
  }

  const renderCreateView = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-sidebar-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <PlusIcon className="h-8 w-8 text-sidebar-foreground/40" />
        </div>
        <h3 className="text-sidebar-foreground text-lg font-semibold mb-2">
          Create Your Own Chatbot
        </h3>
        <p className="text-sidebar-foreground/70 mb-6">
          To create your own AI chatbot, you'll need to access the admin panel where you can build, train, and deploy your custom AI assistant.
        </p>
        <Button
          onClick={handleBackToAdmin}
        >
          Go to Admin Panel
        </Button>
      </div>
    )
  )

  const renderDiscoverView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-sidebar-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sidebar-foreground">Loading chatbots...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-sidebar-foreground mb-2">Error</h2>
            <p className="text-sidebar-foreground/70 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
            >
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-medium text-white mb-2">
                    Discover AI Chatbots
                  </h1>
                  <p className="text-gray-400">
                    Explore our library of public AI chatbots created by the community
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <SparklesIcon className="h-3 w-3 mr-1" />
                    {projects.length} Bots Available
                  </Badge>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full max-w-2xl mx-auto mb-6">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sidebar-foreground/40" />
                <Input
                  placeholder="Search chatbots, creators, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-4 mb-6 overflow-x-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80 flex-shrink-0"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filters
                </Button>
                
                <div className="flex items-center gap-2 overflow-x-auto">
                  {filterTabs.map((tab) => (
                    <Button
                      key={tab.name}
                      variant={activeFilter === tab.name ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveFilter(tab.name)}
                      className={`whitespace-nowrap flex-shrink-0 ${
                        activeFilter === tab.name
                          ? "bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      {tab.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category
                        ? "bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-sidebar-foreground">
                  {activeFilter} Chatbots
                </h2>
                <span className="text-sidebar-foreground/60 text-sm">
                  {filteredBots.length} results
                </span>
              </div>
              <p className="text-sidebar-foreground/60 text-sm">
                {activeFilter === "Featured" 
                  ? "Hand-picked chatbots showcasing the best of our community"
                  : `Discover amazing ${activeFilter.toLowerCase()} chatbots from our community`
                }
              </p>
            </div>

            {/* Chatbots Grid */}
            {filteredBots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredBots.map((project) => (
                  <Card
                    key={project.id}
                    className="group bg-sidebar-accent border-sidebar-border hover:border-sidebar-foreground/20 transition-all duration-200 cursor-pointer overflow-hidden"
                    onClick={() => handleProjectClick(project)}
                  >
                    {/* Project Preview with Image */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={project.preview.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {project.featured && (
                          <Badge className="bg-yellow-500 text-yellow-900 text-xs">
                            Featured
                          </Badge>
                        )}
                        {project.trending && (
                          <Badge className="bg-red-500 text-white text-xs">
                            <TrendingUpIcon className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      
                      {/* Action button */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs text-white font-medium flex-shrink-0">
                            {project.authorAvatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-sidebar-foreground/70 truncate">
                              {project.creator}
                            </p>
                            {project.isPro && (
                              <Badge variant="secondary" className="text-xs mt-1 bg-sidebar-foreground/10 text-sidebar-foreground/70">
                                PRO
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-sidebar-foreground/70">{project.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-sm font-medium text-sidebar-foreground mb-2 line-clamp-1">
                        {project.name}
                      </h3>


                      {/* Tags */}
                      {project.category && (
                        <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20 mb-4">
                          {project.category}
                        </Badge>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-sidebar-foreground/60">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <MessageSquareIcon className="h-3 w-3" />
                            <span>{project.conversations.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UsersIcon className="h-3 w-3" />
                            <span>{project.users.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-sidebar-foreground text-lg font-semibold mb-2">
                    {projects.length === 0 ? 'No public chatbots yet' : 'No chatbots found'}
                  </h3>
                  <p className="text-sidebar-foreground/70 mb-4">
                    {projects.length === 0 
                      ? 'Be the first to create a public chatbot for the community!'
                      : 'No chatbots match your current search and filter criteria.'
                    }
                  </p>
                  {projects.length === 0 ? (
                    <Button
                      onClick={handleBackToAdmin}
                      className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
                    >
                      Create Your First Bot
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("All Categories")
                        setActiveFilter("Featured")
                      }}
                      className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="/chat">
                  <ArrowUpCircleIcon className="h-5 w-5" />
                  <span className="text-base font-semibold">Thetails</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex flex-col gap-2 p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'discover'}
                  onClick={() => setCurrentView('discover')}
                >
                  <SearchIcon className="h-4 w-4" />
                  <span>Discover</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'create'}
                  onClick={() => setCurrentView('create')}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create AI</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-2">
            <Button
              variant="outline"
              onClick={handleBackToAdmin}
              className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <div className="sticky top-0 z-50 bg-background rounded-t-xl overflow-hidden flex-shrink-0">
          <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
              <div className="-ml-1 text-white hover:text-white" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4 bg-white/20"
              />
              <h1 className="text-base font-medium text-white">
                {currentView === 'discover' ? 'Discover' : 'Create AI'}
              </h1>
            </div>
          </header>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          {currentView === 'discover' ? renderDiscoverView() : renderCreateView()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}