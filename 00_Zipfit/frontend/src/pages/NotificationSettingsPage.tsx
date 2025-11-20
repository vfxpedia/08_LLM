import { useState } from 'react';
import { UserProfile } from '../App';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Bell,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface NotificationSettingsPageProps {
  userProfile: UserProfile | null;
}

export function NotificationSettingsPage({ userProfile }: NotificationSettingsPageProps) {
  const [settings, setSettings] = useState({
    newAnnouncements: true,
    matchingAnnouncements: true,
    deadlineReminders: true,
    winnerAnnouncement: false,
    chatResponses: true,
    systemUpdates: false,
    frequency: 'immediate',
  });

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings
    localStorage.setItem('notificationSettings', JSON.stringify({
      settings,
      emailNotifications,
      pushNotifications,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!userProfile) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-card rounded-xl shadow-sm border p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-2">사용자 정보가 필요합니다</h2>
          <p className="text-muted-foreground">
            알림 설정을 위해서는 먼저 사용자 정보를 입력해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">알림 설정</h1>
          <p className="text-muted-foreground">
            {userProfile.name}님께 맞는 정보를 적시에 알려드립니다
          </p>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-900">알림 설정이 저장되었습니다</p>
          </div>
        )}

        {/* Notification Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-gray-900 mb-6">알림 항목</h2>
          
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="newAnnouncements" className="text-gray-900 cursor-pointer">
                  새로운 공고 등록
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  LH, SH, GH에 새로운 공고가 등록되면 알려드립니다
                </p>
              </div>
              <Switch
                id="newAnnouncements"
                checked={settings.newAnnouncements}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, newAnnouncements: checked })
                }
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="matchingAnnouncements" className="text-gray-900 cursor-pointer">
                  맞춤형 공고 추천
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  내 조건에 맞는 공고가 등록되면 우선 알려드립니다
                </p>
              </div>
              <Switch
                id="matchingAnnouncements"
                checked={settings.matchingAnnouncements}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, matchingAnnouncements: checked })
                }
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="deadlineReminders" className="text-gray-900 cursor-pointer">
                  마감일 리마인더
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  관심 공고의 마감일이 임박하면 알려드립니다
                </p>
              </div>
              <Switch
                id="deadlineReminders"
                checked={settings.deadlineReminders}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, deadlineReminders: checked })
                }
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="winnerAnnouncement" className="text-gray-900 cursor-pointer">
                  당첨자 발표
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  당첨자 발표일에 알림을 보내드립니다
                </p>
              </div>
              <Switch
                id="winnerAnnouncement"
                checked={settings.winnerAnnouncement}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, winnerAnnouncement: checked })
                }
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="chatResponses" className="text-gray-900 cursor-pointer">
                  AI 상담 응답
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  AI 상담 응답이 준비되면 알려드립니다
                </p>
              </div>
              <Switch
                id="chatResponses"
                checked={settings.chatResponses}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, chatResponses: checked })
                }
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="systemUpdates" className="text-gray-900 cursor-pointer">
                  시스템 업데이트
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  새로운 기능이나 중요한 업데이트를 알려드립니다
                </p>
              </div>
              <Switch
                id="systemUpdates"
                checked={settings.systemUpdates}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, systemUpdates: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-gray-900 mb-6">알림 방식</h2>
          
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <Label htmlFor="emailNotifications" className="text-gray-900 cursor-pointer">
                    이메일 알림
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    example@email.com
                  </p>
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <Label htmlFor="pushNotifications" className="text-gray-900 cursor-pointer">
                    푸시 알림
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    브라우저 푸시 알림
                  </p>
                </div>
              </div>
              <Switch
                id="pushNotifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-gray-900 mb-6">알림 빈도</h2>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">알림을 받을 빈도를 선택하세요</Label>
            <Select value={settings.frequency} onValueChange={(value) => setSettings({ ...settings, frequency: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="빈도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">즉시 알림 (권장)</SelectItem>
                <SelectItem value="daily">하루 1회 요약</SelectItem>
                <SelectItem value="weekly">주 1회 요약</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              즉시 알림을 선택하면 중요한 정보를 놓치지 않고 받을 수 있습니다
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl p-6 mb-6">
          <div className="flex gap-3">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-zinc-900 dark:text-zinc-100 mb-2">알림 설정 팁</h3>
              <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                <li>• <strong>맞춤형 공고 추천</strong>은 가장 중요한 알림입니다</li>
                <li>• <strong>마감일 리마인더</strong>로 놓치는 공고가 없도록 하세요</li>
                <li>• 너무 많은 알림은 부담스러울 수 있으니 필요한 항목만 선택하세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1" size="lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            설정 저장
          </Button>
        </div>
      </div>
    </div>
  );
}