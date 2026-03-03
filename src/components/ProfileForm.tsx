import React, { useState } from 'react';
import { ProfileData } from '../types';
import { extractProfileFromImage } from '../services/geminiService';
import { Upload, Loader2, FileText, Code2, Github, LayoutTemplate, Briefcase, Award, Target, BookOpen } from 'lucide-react';

interface ProfileFormProps {
  onSubmit: (data: ProfileData) => void;
  isLoading: boolean;
}

export function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>({
    education: '',
    skills: '',
    github: '',
    leetcode: '',
    projects: '',
    internships: '',
    certifications: '',
    careerGoal: '',
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const processFile = async (file: File) => {
    setIsExtracting(true);
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const extracted = await extractProfileFromImage(base64Data, file.type);
      
      const newData = {
        education: extracted.education || formData.education,
        skills: extracted.skills || formData.skills,
        github: extracted.github || formData.github,
        leetcode: extracted.leetcode || formData.leetcode,
        projects: extracted.projects || formData.projects,
        internships: extracted.internships || formData.internships,
        certifications: extracted.certifications || formData.certifications,
        careerGoal: extracted.careerGoal || formData.careerGoal,
      };
      
      setFormData(newData);
      onSubmit(newData); // Automatically analyze after extraction
    } catch (error) {
      console.error('Error extracting from image:', error);
      alert('Failed to extract profile from image.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    await processFile(file);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200/60 overflow-hidden">
      {/* Upload Section */}
      <div className="bg-zinc-50 border-b border-zinc-200/60 p-8 sm:p-10 text-center">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">Fastest Way: Upload Resume</h3>
        <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
          Upload an image of your resume and our AI will automatically extract your details and analyze your profile.
        </p>
        <div className="relative max-w-sm mx-auto">
          <input
            type="file"
            accept="image/*"
            id="resume-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileUpload}
            disabled={isExtracting || isLoading}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
          <div className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all ${isExtracting || isLoading ? 'border-indigo-400 bg-indigo-50' : isDragging ? 'border-indigo-500 bg-indigo-100' : 'border-zinc-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'}`}>
            {isExtracting || isLoading ? (
              <>
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                <span className="text-sm font-medium text-indigo-700">
                  {isExtracting ? 'Extracting data...' : 'Analyzing profile...'}
                </span>
              </>
            ) : (
              <>
                <div className={`p-3 rounded-full mb-3 ${isDragging ? 'bg-indigo-200' : 'bg-indigo-100'}`}>
                  <Upload className={`w-6 h-6 ${isDragging ? 'text-indigo-700' : 'text-indigo-600'}`} />
                </div>
                <span className="text-sm font-medium text-zinc-700">
                  {isDragging ? 'Drop image here' : 'Click or drag image here'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-8 sm:p-10">
        <div className="flex items-center mb-8">
          <div className="flex-grow h-px bg-zinc-200"></div>
          <span className="px-4 text-sm font-medium text-zinc-400 uppercase tracking-wider">Or enter manually</span>
          <div className="flex-grow h-px bg-zinc-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-zinc-400" /> Education
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows={3}
                placeholder="e.g. B.Tech CS, Tier 3 College, 8.5 CGPA"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center">
                <Code2 className="w-4 h-4 mr-2 text-zinc-400" /> Skills
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows={3}
                placeholder="e.g. React, Node.js, Python, AWS"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center">
                <Github className="w-4 h-4 mr-2 text-zinc-400" /> GitHub Summary
              </label>
              <textarea
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows={2}
                placeholder="e.g. 15 repos, 200 contributions in last year"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-zinc-400" /> LeetCode Stats
              </label>
              <textarea
                name="leetcode"
                value={formData.leetcode}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows={2}
                placeholder="e.g. 300 solved (100 Easy, 150 Medium, 50 Hard)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center">
                <LayoutTemplate className="w-4 h-4 mr-2 text-zinc-400" /> Projects
              </label>
              <textarea
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows={3}
                placeholder="e.g. E-commerce app (MERN), Chat app (Socket.io)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-zinc-400" /> Internships
              </label>
              <textarea
                name="internships"
                value={formData.internships}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows={3}
                placeholder="e.g. SDE Intern at Startup X (3 months)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center">
                <Award className="w-4 h-4 mr-2 text-zinc-400" /> Certifications
              </label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows={2}
                placeholder="e.g. AWS Certified Developer Associate"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center">
                <Target className="w-4 h-4 mr-2 text-zinc-400" /> Career Goal
              </label>
              <textarea
                name="careerGoal"
                value={formData.careerGoal}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows={2}
                placeholder="e.g. SDE-1 at a Product Company"
              />
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-zinc-100">
            <button
              type="submit"
              disabled={isLoading || isExtracting}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Generating Intelligence Report...
                </>
              ) : (
                'Evaluate My Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
