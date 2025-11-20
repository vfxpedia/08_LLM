import { useState, useEffect } from 'react';
import { UserProfile } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, MapPin, Calendar, Users, Banknote } from 'lucide-react';

interface UserProfileModalProps {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export function UserProfileModal({ initialProfile, onSave, onClose }: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      name: '',
      age: 20,
      residence: '',
      residenceDuration: 0,
      maritalStatus: 'single',
      hasChildren: false,
      numberOfChildren: 0,
      income: 0,
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};
    
    if (!profile.name.trim()) newErrors.name = '이름을 입력해주세요';
    if (profile.age < 19 || profile.age > 100) newErrors.age = '올바른 나이를 입력해주세요';
    if (!profile.residence.trim()) newErrors.residence = '거주지를 입력해주세요';
    if (profile.residenceDuration < 0) newErrors.residenceDuration = '거주기간을 입력해주세요';
    if (profile.income < 0) newErrors.income = '소득을 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(profile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800">
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
          <h2 className="text-zinc-900 dark:text-zinc-100">사용자 정보 입력</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            맞춤형 주택 정보를 제공하기 위해 필요한 정보입니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <User className="w-4 h-4" />
              이름
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="홍길동"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500 dark:text-red-400">{errors.name}</p>}
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Calendar className="w-4 h-4" />
              나이
            </Label>
            <Input
              id="age"
              type="number"
              value={profile.age === 0 ? '' : profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value === '' ? 0 : parseInt(e.target.value) })}
              onFocus={(e) => e.target.select()}
              placeholder="27"
              className={errors.age ? 'border-red-500' : ''}
            />
            {errors.age && <p className="text-sm text-red-500 dark:text-red-400">{errors.age}</p>}
          </div>

          {/* Residence */}
          <div className="space-y-2">
            <Label htmlFor="residence" className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <MapPin className="w-4 h-4" />
              현재 거주지
            </Label>
            <Input
              id="residence"
              value={profile.residence}
              onChange={(e) => setProfile({ ...profile, residence: e.target.value })}
              placeholder="경기도 고양시 일산동구"
              className={errors.residence ? 'border-red-500' : ''}
            />
            {errors.residence && <p className="text-sm text-red-500 dark:text-red-400">{errors.residence}</p>}
          </div>

          {/* Residence Duration */}
          <div className="space-y-2">
            <Label htmlFor="residenceDuration" className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Calendar className="w-4 h-4" />
              거주 기간 (년)
            </Label>
            <Input
              id="residenceDuration"
              type="number"
              value={profile.residenceDuration === 0 ? '' : profile.residenceDuration}
              onChange={(e) => setProfile({ ...profile, residenceDuration: e.target.value === '' ? 0 : parseInt(e.target.value) })}
              onFocus={(e) => e.target.select()}
              placeholder="2"
              className={errors.residenceDuration ? 'border-red-500' : ''}
            />
            {errors.residenceDuration && <p className="text-sm text-red-500 dark:text-red-400">{errors.residenceDuration}</p>}
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <Label htmlFor="maritalStatus" className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Users className="w-4 h-4" />
              혼인 상태
            </Label>
            <Select
              value={profile.maritalStatus}
              onValueChange={(value: 'single' | 'married' | 'other') =>
                setProfile({ ...profile, maritalStatus: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">미혼</SelectItem>
                <SelectItem value="married">기혼</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Children */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Users className="w-4 h-4" />
              자녀 유무
            </Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                <input
                  type="radio"
                  checked={!profile.hasChildren}
                  onChange={() => setProfile({ ...profile, hasChildren: false, numberOfChildren: 0 })}
                  className="w-4 h-4"
                />
                <span>없음</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                <input
                  type="radio"
                  checked={profile.hasChildren}
                  onChange={() => setProfile({ ...profile, hasChildren: true })}
                  className="w-4 h-4"
                />
                <span>있음</span>
              </label>
            </div>
          </div>

          {profile.hasChildren && (
            <div className="space-y-2">
              <Label htmlFor="numberOfChildren" className="text-zinc-900 dark:text-zinc-100">자녀 수</Label>
              <Input
                id="numberOfChildren"
                type="number"
                value={profile.numberOfChildren === 0 ? '' : profile.numberOfChildren}
                onChange={(e) => setProfile({ ...profile, numberOfChildren: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                onFocus={(e) => e.target.select()}
                placeholder="1"
                min="1"
              />
            </div>
          )}

          {/* Income */}
          <div className="space-y-2">
            <Label htmlFor="income" className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Banknote className="w-4 h-4" />
              연소득 (만원)
            </Label>
            <Input
              id="income"
              type="number"
              value={profile.income === 0 ? '' : profile.income}
              onChange={(e) => setProfile({ ...profile, income: e.target.value === '' ? 0 : parseInt(e.target.value) })}
              onFocus={(e) => e.target.select()}
              placeholder="3000"
              className={errors.income ? 'border-red-500' : ''}
            />
            {errors.income && <p className="text-sm text-red-500 dark:text-red-400">{errors.income}</p>}
            <p className="text-sm text-zinc-500 dark:text-zinc-400">소득이 없는 경우 0을 입력해주세요</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              저장하기
            </Button>
            {initialProfile && (
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}