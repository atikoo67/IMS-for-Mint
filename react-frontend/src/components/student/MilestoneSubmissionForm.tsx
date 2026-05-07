// Student component for submitting milestones (FR-MIL-001 to FR-MIL-005)
import React, { useState } from 'react';
import { MilestoneFormData } from '../../types';
import { Input, Textarea, FileUpload, Button, Card } from '../common';
import { validateMilestoneDescription } from '../../utils/validation';
import { milestoneService } from '../../services';

interface MilestoneSubmissionFormProps {
  onSuccess: () => void;
}

export const MilestoneSubmissionForm: React.FC<MilestoneSubmissionFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    attachment: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MilestoneFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MilestoneFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!validateMilestoneDescription(formData.description)) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await milestoneService.submitMilestone(formData);
      alert('Milestone submitted successfully!');
      setFormData({ title: '', description: '', attachment: null });
      onSuccess();
    } catch (error) {
      alert('Failed to submit milestone');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Submit New Milestone">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Milestone Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
          placeholder="e.g., Week 1 Progress Report"
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          required
          rows={6}
          helperText="Minimum 50 characters required"
          showCharCount
          maxLength={2000}
          placeholder="Describe your progress, achievements, and challenges..."
        />

        <FileUpload
          label="Attachment (Optional)"
          onChange={(file) => setFormData({ ...formData, attachment: file })}
          currentFile={formData.attachment}
          helperText="PDF or DOCX, max 10 MB"
        />

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Submit Milestone
          </Button>
        </div>
      </form>
    </Card>
  );
};
