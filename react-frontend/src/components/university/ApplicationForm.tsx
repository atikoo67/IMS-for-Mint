// University User component for submitting applications (FR-APP-001 to FR-APP-008)
import React, { useState } from 'react';
import { ApplicationFormData } from '../../types';
import { Input, FileUpload, Button, Card } from '../common';
import { validateEmail, validateGPA } from '../../utils/validation';
import { applicationService } from '../../services';

interface ApplicationFormProps {
  onSuccess: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    student_name: '',
    student_institutional_id: '',
    department: '',
    gpa: 0,
    institutional_email: '',
    transcript: null,
    request_letter: null,
    recommendation_letter: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {};

    if (!formData.student_name.trim()) {
      newErrors.student_name = 'Student name is required';
    }

    if (!formData.student_institutional_id.trim()) {
      newErrors.student_institutional_id = 'Student ID is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!validateGPA(formData.gpa)) {
      newErrors.gpa = 'GPA must be between 0 and 4.0';
    }

    if (!validateEmail(formData.institutional_email)) {
      newErrors.institutional_email = 'Valid institutional email is required';
    }

    if (!formData.transcript) {
      newErrors.transcript = 'Transcript is required';
    }

    if (!formData.request_letter) {
      newErrors.request_letter = 'Request letter is required';
    }

    if (!formData.recommendation_letter) {
      newErrors.recommendation_letter = 'Recommendation letter is required';
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
      await applicationService.submitApplication(formData);
      alert('Application submitted successfully!');
      onSuccess();
    } catch (error) {
      alert('Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="New Internship Application">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Student Full Name"
            value={formData.student_name}
            onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
            error={errors.student_name}
            required
          />

          <Input
            label="Student Institutional ID"
            value={formData.student_institutional_id}
            onChange={(e) =>
              setFormData({ ...formData, student_institutional_id: e.target.value })
            }
            error={errors.student_institutional_id}
            required
          />

          <Input
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            error={errors.department}
            required
          />

          <Input
            label="GPA"
            type="number"
            step="0.01"
            min="0"
            max="4.0"
            value={formData.gpa || ''}
            onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })}
            error={errors.gpa}
            required
          />

          <Input
            label="Institutional Email"
            type="email"
            value={formData.institutional_email}
            onChange={(e) => setFormData({ ...formData, institutional_email: e.target.value })}
            error={errors.institutional_email}
            required
            className="md:col-span-2"
          />
        </div>

        <div className="space-y-4 border-t pt-6">
          <h4 className="font-medium text-gray-900">Required Documents</h4>
          <p className="text-sm text-gray-600">
            Upload PDF or DOCX files only. Maximum file size: 10 MB per file.
          </p>

          <FileUpload
            label="Academic Transcript"
            onChange={(file) => setFormData({ ...formData, transcript: file })}
            error={errors.transcript}
            currentFile={formData.transcript}
            required
          />

          <FileUpload
            label="University Request Letter"
            onChange={(file) => setFormData({ ...formData, request_letter: file })}
            error={errors.request_letter}
            currentFile={formData.request_letter}
            required
          />

          <FileUpload
            label="Recommendation Letter"
            onChange={(file) => setFormData({ ...formData, recommendation_letter: file })}
            error={errors.recommendation_letter}
            currentFile={formData.recommendation_letter}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Submit Application
          </Button>
        </div>
      </form>
    </Card>
  );
};
