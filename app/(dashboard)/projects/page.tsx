'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, AlertCircle } from 'lucide-react'
import { useProjectsViewModel } from '@/viewmodels/projects.viewmodel'
import { 
  ProjectForm, 
  SearchBar, 
  StatsGrid, 
  ProjectList 
} from '@/views/projects'

export default function ProjectsPage() {
  const viewModel = useProjectsViewModel()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">프로젝트 관리</h1>
        <Button onClick={viewModel.openCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          새 프로젝트
        </Button>
      </div>

      {/* Create/Edit Project Form */}
      {viewModel.showCreateForm && (
        <ProjectForm
          formData={viewModel.formData}
          isSubmitting={viewModel.isSubmitting}
          editingProject={viewModel.editingProject}
          isFormValid={viewModel.isFormValid}
          onSubmit={viewModel.handleSubmit}
          onCancel={viewModel.closeForm}
          onFormDataChange={viewModel.updateFormData}
        />
      )}

      {/* Search */}
      <SearchBar
        searchQuery={viewModel.searchQuery}
        onSearchChange={viewModel.setSearchQuery}
      />

      {/* Project Stats */}
      <StatsGrid stats={viewModel.stats} />

      {/* Loading State */}
      {viewModel.isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
      )}

      {/* Error State */}
      {viewModel.error && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{viewModel.error}</p>
          </CardContent>
        </Card>
      )}

      {/* Project Lists */}
      {!viewModel.isLoading && !viewModel.error && (
        <>
          {/* Active Projects */}
          <ProjectList
            title="활성 프로젝트"
            projects={viewModel.activeProjects}
            onEdit={viewModel.handleEdit}
            onDelete={viewModel.handleDelete}
            getCompletionRate={viewModel.getCompletionRate}
            emptyMessage="활성 프로젝트가 없습니다."
            onCreateNew={viewModel.openCreateForm}
          />

          {/* Archived Projects */}
          {viewModel.hasArchivedProjects && (
            <ProjectList
              title="보관된 프로젝트"
              projects={viewModel.archivedProjects}
              onEdit={viewModel.handleEdit}
              onDelete={viewModel.handleDelete}
              getCompletionRate={viewModel.getCompletionRate}
            />
          )}
        </>
      )}
    </div>
  )
}
