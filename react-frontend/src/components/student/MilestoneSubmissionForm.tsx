// Student component for submitting milestones (FR-MIL-001 to FR-MIL-005) - Enhanced
import React, { useState, useEffect } from 'react';
import { Milestone, MilestoneFormData } from '../../types';
import { Input, Textarea, FileUpload, Button } from '../common';
import { validateMilestoneDescription } from '../../utils/validation';
import { milestoneService } from '../../services';

interface MilestoneSubmissionFormProps {
  milestone?: Milestone; // For editing
  onSuccess: (message?: string) => void;
}

export const MilestoneSubmissionForm: React.FC<MilestoneSubmissionFormProps> = ({ 
  milestone,
  onSuccess 
}) => {
  const [formData, setFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    attachment: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MilestoneFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const isEditMode = !!milestone;

  useEffect(() => {
    if (milestone) {
      setFormData({
        title: milestone.title,
        description: milestone.description || '',
        attachment: null,
      });
      setCharCount(milestone.description?.length || 0);
    }
  }, [milestone]);

  useEffect(() => {
    setCharCount(formData.description.length);
  }, [formData.description]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MilestoneFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (!validateMilestoneDescription(formData.description)) {
      newErrors.description = 'Description must be at least 50 characters';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'Description must not exceed 2000 characters';
    }

    // File size validation
    if (formData.attachment && formData.attachment.size > 10 * 1024 * 1024) {
      newErrors.attachment = 'File size must not exceed 10 MB';
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
      if (isEditMode && milestone) {
        await milestoneService.updateMilestone(milestone.milestone_id, formData);
        onSuccess('Milestone updated and resubmitted successfully!');
      } else {
        await milestoneService.submitMilestone(formData);
        onSuccess('Milestone submitted successfully! Your supervisor will review it soon.');
      }
      
      // Reset form
      setFormData({ title: '', description: '', attachment: null });
      setCharCount(0);
    } catch (error: any) {
      // Error will be shown via toast in parent component
      console.error('Failed to submit milestone:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getDescriptionHelperText = () => {
    const remaining = 50 - charCount;
    if (charCount < 50) {
      return `${remaining} more character${remaining !== 1 ? 's' : ''} required (minimum 50)`;
    }
    return `${charCount} / 2000 characters`;
  };

  const isDescriptionValid = charCount >= 50 && charCount <= 2000;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isEditMode && milestone?.feedback && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-900 mb-1">
                Supervisor Feedback - Please Address:
              </h4>
              <p className="text-sm text-yellow-800">{milestone.feedback}</p>
            </div>
          </div>
        </div>
      )}

      <Input
        label="Milestone Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        required
        placeholder="e.g., Week 1 Progress Report, Database Design Completion"
        helperText="Give your milestone a clear, descriptive title"
        disabled={isEditMode} // Title cannot be changed in edit mode
      />

      <div className="space-y-2">
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          required
          rows={8}
          helperText={getDescriptionHelperText()}
          maxLength={2000}
          placeholder="Describe your progress in detail:
• What tasks did you complete?
• What challenges did you face?
• What did you learn?
• What are your next steps?

Be specific and provide examples of your work."
        />
        
        {/* Visual progress indicator for description */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isDescriptionValid ? 'bg-green-500' : 
                charCount > 0 ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
              style={{ width: `${Math.min((charCount / 50) * 100, 100)}%` }}
            />
          </div>
          {isDescriptionValid && (
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      <FileUpload
        label="Attachment (Optional)"
        onChange={(file) => setFormData({ ...formData, attachment: file })}
        currentFile={formData.attachment}
        helperText="Upload supporting documents (PDF, DOCX, or images). Max 10 MB"
        error={errors.attachment}
      />

      {/* Submission Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Submission Guidelines
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• Be specific and detailed in your description</li>
          <li>• Include measurable achievements and outcomes</li>
          <li>• Mention any challenges and how you addressed them</li>
          <li>• Attach relevant documents or screenshots if available</li>
          <li>• Your supervisor will review and provide feedback</li>
        </ul>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isLoading}
          disabled={!isDescriptionValid || !formData.title.trim()}
        >
          {isLoading ? 'Submitting...' : isEditMode ? 'Resubmit Milestone' : 'Submit Milestone'}
        </Button>
      </div>
    </form>
  );
};
