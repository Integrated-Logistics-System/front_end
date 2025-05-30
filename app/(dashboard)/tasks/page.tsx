'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTasksViewModel } from '@/viewmodels/tasks.viewmodel'
import { 
  TaskCreateForm, 
  TaskFilters, 
  TaskStats, 
  TaskGrid 
} from '@/views/tasks'

export default function TasksPage() {
  const viewModel = useTasksViewModel()

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      viewModel.handleCreateFromNaturalLanguage()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">작업 관리</h1>
        <Button onClick={viewModel.openCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          새 작업
        </Button>
      </div>

      {/* Create Task Form */}
      {viewModel.showCreateForm && (
        <TaskCreateForm
          naturalLanguageInput={viewModel.naturalLanguageInput}
          isCreating={viewModel.isCreating}
          isFormValid={viewModel.isFormValid}
          onInputChange={viewModel.updateNaturalLanguageInput}
          onCreate={viewModel.handleCreateFromNaturalLanguage}
          onCancel={viewModel.closeCreateForm}
          onKeyPress={handleKeyPress}
        />
      )}

      {/* Filters */}
      <TaskFilters
        searchQuery={viewModel.searchQuery}
        statusFilter={viewModel.statusFilter}
        priorityFilter={viewModel.priorityFilter}
        projectFilter={viewModel.projectFilter}
        projects={viewModel.projects || []}
        onSearchChange={viewModel.setSearchQuery}
        onStatusChange={viewModel.setStatusFilter}
        onPriorityChange={viewModel.setPriorityFilter}
        onProjectChange={viewModel.setProjectFilter}
      />

      {/* Task Grid */}
      <TaskGrid
        tasks={viewModel.tasks}
        getProjectName={viewModel.getProjectName}
        onStatusToggle={viewModel.toggleTaskStatus}
        onDelete={viewModel.handleDeleteTask}
        onCreateNew={viewModel.openCreateForm}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
      />

      {/* Task Stats */}
      <TaskStats stats={viewModel.taskStats} />
    </div>
  )
}
