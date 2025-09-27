"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Lightbulb, UserPlus, Bot, ArrowLeft, Send, Upload, FileCheck } from 'lucide-react';
import { askExpert, gyanAI, interviewPrepper } from '@/app/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Message } from '@/ai/flows/types';

const initialExperts = [
  { id: '1', name: "Dr. Ramesh Kumar", experience: 15, specialization: "Dairy Technology", photo: "https://placehold.co/150x150/E2E8F0/4A5568?text=R", type: 'ai' },
  { id: '2', name: "Sunita Sharma", experience: 12, specialization: "Food Safety and Quality", photo: "https://placehold.co/150x150/E2E8F0/4A5568?text=S", type: 'ai' },
  { id: '3', name: "Anil Singh", experience: 20, specialization: "Food Processing", photo: "https://placehold.co/150x150/E2E8F0/4A5568?text=A", type: 'ai' }
];

interface UIMessage { id: string; role: "user" | "assistant"; text: string; }

export function ExpertSupportModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void; }) {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedExpert, setSelectedExpert] = useState<typeof initialExperts[0] | null>(null);

  const handleSelectExpert = useCallback((expert: typeof initialExperts[0]) => {
      setSelectedExpert(expert);
      setActivePage('chat');
  }, []);

  const handleBackToHome = useCallback(() => {
      setActivePage('home');
      setSelectedExpert(null);
  }, []);

  const renderPage = () => {
      switch (activePage) {
          case 'chat': return <ChatPage expert={selectedExpert!} onBack={handleBackToHome} />;
          case 'gyan-ai': return <GyanAIPage onBack={() => setActivePage('home')} />;
          case 'register': return <RegisterExpertPage onBack={() => setActivePage('home')} />;
          case 'home':
          default: return <HomePage onSelectExpert={handleSelectExpert} setActivePage={setActivePage} />;
      }
  };

  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-6xl w-[95vw] h-full max-h-[90vh] flex flex-col p-0 sm:p-6">
              <DialogHeader className="p-4 sm:p-0 shrink-0">
                  <DialogTitle className="text-2xl md:text-3xl font-bold text-center text-gray-800 font-headline">
                      💡 Experts Suggest
                  </DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0">
                  {renderPage()}
              </div>
          </DialogContent>
      </Dialog>
  );
}

function HomePage({ setActivePage, onSelectExpert }: { setActivePage: (page: string) => void, onSelectExpert: (expert: any) => void }) {
  const [expertType, setExpertType] = useState<'ai' | 'real'>('ai');
  const [experts, setExperts] = useState(initialExperts);
  const filteredExperts = useMemo(() => experts.filter(e => e.type === expertType), [experts, expertType]);
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="text-center my-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Advice from Industry Experts</h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">Choose between instant AI-powered answers or connect with real-world professionals.</p>
        </div>
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 rounded-full p-1 flex items-center">
            <Button onClick={() => setExpertType('ai')} variant={expertType === 'ai' ? 'default' : 'ghost'} className="rounded-full shadow-sm">AI Experts</Button>
            <Button onClick={() => setExpertType('real')} variant={expertType === 'real' ? 'default' : 'ghost'} className="rounded-full shadow-sm" disabled>Real Experts (Coming Soon)</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredExperts.map(expert => (
            <div key={expert.id} className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer" onClick={() => onSelectExpert(expert)}>
              <img className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-200" src={expert.photo} data-ai-hint="profile photo" alt={expert.name} />
              <h4 className="text-lg font-semibold text-gray-900">{expert.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{expert.experience}+ years in {expert.specialization}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 space-x-4">
          <Button variant="secondary" onClick={() => setActivePage('gyan-ai')}>Go to Gyan AI <Lightbulb className="ml-2"/></Button>
          <Button variant="outline" onClick={() => setActivePage('register')}>Become an Expert <UserPlus className="ml-2" /></Button>
        </div>
      </div>
    </ScrollArea>
  );
}

function ChatInterface({ title, description, initialMessage, onBack, apiCall, apiCallPayload, isInterviewPrep = false }: { title: string, description: string, initialMessage: string, onBack: () => void, apiCall: (payload: any) => Promise<any>, apiCallPayload: (query: string, history: Message[], isInitial?: boolean) => any, isInterviewPrep?: boolean }) {
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [history, setHistory] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const initialMessageSent = useRef(false);

    useEffect(() => {
        const sendInitialMessage = async () => {
            setIsLoading(true);
            try {
                const payload = apiCallPayload("", [], true); // isInitial = true
                const response = await apiCall(payload);
                
                if (!response) {
                    throw new Error("Received an empty response from the server.");
                }

                let responseText: string;
                 if (isInterviewPrep && response && Array.isArray(response.response)) {
                    if (response.response.length === 0) {
                        responseText = response.followUpSuggestion || "Sorry, I couldn't generate any questions. Please try again with a different resume.";
                    } else {
                        responseText = response.response.map((qa: any) => `<strong>Q: ${qa.question}</strong><br/>${qa.answer}`).join('<br/><br/>') + `<br/><br/><em>${response.followUpSuggestion || ""}</em>`;
                    }
                } else if (response?.answer) {
                     responseText = response.answer;
                } else {
                     responseText = response?.refinedQuestion?.refinedQuestion || "Sorry, no answer received.";
                }

                const initialAssistantMessage: UIMessage = { id: "initial-q", role: "assistant", text: responseText };
                setMessages([initialAssistantMessage]);
                if (responseText) {
                    setHistory([{ role: 'model', content: [{ text: responseText }] }]);
                }
            } catch (error: any) {
                console.error(error);
                toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to start the session.' });
                const errorMessage: UIMessage = { id: "initial-error", role: "assistant", text: "Sorry, I couldn't start the session. Please try again." };
                setMessages([errorMessage]);
            } finally {
                setIsLoading(false);
            }
        };

        if (isInterviewPrep && !initialMessageSent.current) {
            sendInitialMessage();
            initialMessageSent.current = true;
        } else if (!isInterviewPrep && messages.length === 0) {
            setMessages([{ id: "initial", role: "assistant", text: initialMessage }]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = input.trim();
        if (!query || isLoading) return;

        const userMessage: UIMessage = { id: Date.now().toString(), role: "user", text: query };
        setMessages((prev) => [...prev, userMessage]);

        const newHistoryForApi: Message[] = [...history, { role: 'user', content: [{ text: query }] }];
        setInput("");
        setIsLoading(true);

        try {
            const payload = apiCallPayload(query, newHistoryForApi, false); // Not an initial request
            const response = await apiCall(payload);
            
            if (!response) {
                throw new Error("Received an empty response from the server.");
            }

            let assistantMessage: UIMessage;
            let responseText: string;

            if (isInterviewPrep && response && Array.isArray(response.response)) {
                if (response.response.length === 0) {
                    responseText = response.followUpSuggestion || "Sorry, I couldn't generate a follow-up. Please ask another question.";
                } else {
                    responseText = response.response.map((qa: any) => `<strong>Q: ${qa.question}</strong><br/>${qa.answer}`).join('<br/><br/>') + `<br/><br/><em>${response.followUpSuggestion || ""}</em>`;
                }
            } else if (response?.answer) {
                 responseText = response.answer;
            } else {
                responseText = response?.refinedQuestion?.refinedQuestion || "Sorry, no valid answer received from the server.";
            }

            assistantMessage = { id: Date.now().toString() + "-ai", role: "assistant", text: responseText };

            setMessages((prev) => [...prev, assistantMessage]);
            if(responseText) {
                setHistory([...newHistoryForApi, { role: 'model', content: [{ text: responseText }] }]);
            }

        } catch (error: any) {
            console.error(error);
            const errorMessage: UIMessage = { id: Date.now().toString() + "-error", role: "assistant", text: error.message || "Sorry, something went wrong. Please try again." };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
             <div className="flex-1 flex flex-col bg-card border rounded-lg overflow-hidden">
                <ScrollArea className="flex-grow p-4" viewportRef={scrollViewportRef}>
                    <div className="flex flex-col gap-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "self-end" : "self-start"}`}>
                                {msg.role === 'assistant' && <div className="bg-muted p-2 rounded-full h-fit shrink-0"><Bot className="w-5 h-5 text-foreground" /></div>}
                                <div className={`flex-1 p-3 rounded-2xl break-words ${msg.role === "user" ? "bg-primary/90 text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"}`}>
                                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="self-start flex gap-3 items-center">
                                <div className="bg-muted p-2 rounded-full h-fit"><Bot className="w-5 h-5 text-foreground" /></div>
                                <div className="bg-muted p-3 rounded-2xl rounded-bl-none">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        Thinking...
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="p-4 border-t bg-background flex items-center gap-2">
                    <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a follow-up question..." className="flex-grow" disabled={isLoading} />
                    <Button type="submit" size="icon" className="shrink-0" disabled={isLoading || !input}><Send /></Button>
                </form>
            </div>
        </div>
    );
}

function ChatPage({ expert, onBack }: { expert: typeof initialExperts[0], onBack: () => void }) {
  const [language, setLanguage] = useState("English");
  const languageRef = useRef(language);
  languageRef.current = language;

  const apiCallPayload = useCallback((query: string, history: Message[]) => {
    return {
        expertName: expert.name,
        experience: expert.experience,
        specialization: expert.specialization,
        question: query,
        language: languageRef.current,
        history: history,
    };
  }, [expert]);

  return (
      <div className="h-full flex flex-col p-4">
        <Button variant="ghost" onClick={onBack} className="self-start mb-2"><ArrowLeft className="mr-2"/> Back to Experts</Button>
        <div className="flex-1 flex flex-col bg-card border rounded-lg overflow-hidden">
            <header className="p-4 border-b flex items-center justify-between gap-4">
                <div className='flex items-center gap-4'>
                    <img className="w-12 h-12 rounded-full object-cover" src={expert.photo} data-ai-hint="profile photo" alt={expert.name} />
                    <div>
                        <h3 className="font-bold">{expert.name}</h3>
                        <p className="text-xs text-muted-foreground">{expert.specialization}</p>
                    </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hinglish">Hinglish</SelectItem>
                    </SelectContent>
                </Select>
            </header>
             <div className="flex-1 min-h-0">
                 <ChatInterface
                        title={expert.name}
                        description={expert.specialization}
                        initialMessage={`Hello! I am ${expert.name}. Ask me anything about ${expert.specialization}.`}
                        onBack={onBack}
                        apiCall={askExpert}
                        apiCallPayload={apiCallPayload}
                    />
            </div>
        </div>
      </div>
  );
}

function GyanAIPage({ onBack }: { onBack: () => void }) {
  const [topic, setTopic] = useState("Dairy Technology");
  const [language, setLanguage] = useState('English');
  const { toast } = useToast();
  const [chatStarted, setChatStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const languageRef = useRef(language);
  languageRef.current = language;
  const topicRef = useRef(topic);
  topicRef.current = topic;


  // For Interview Prep
  const [resumeText, setResumeText] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Fresher Student");
  const [fileName, setFileName] = useState("");

  const pdfReadyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
        const workerModule = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        const workerUrl = (workerModule as any).default || workerModule;
        
        if (typeof workerUrl !== "string") {
          console.error("pdfjs worker import did not return a string URL:", workerModule);
          return;
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
        pdfReadyRef.current = true;
      } catch (err) {
        console.error("Failed to dynamically load pdfjs or its worker:", err);
      }
    })();
  }, []);

  const handleStartChat = () => {
    if (topic === 'Interview Preparation' && !resumeText) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please upload a valid resume.' });
      return;
    }
    setChatStarted(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fname = file.name.toLowerCase();
      setFileName(file.name);
      setIsLoading(true);

      try {
        if (fname.endsWith('.pdf')) {
          if (!pdfReadyRef.current) {
            await new Promise((r) => setTimeout(r, 300));
          }
          const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
          if (typeof (pdfjsLib as any).GlobalWorkerOptions?.workerSrc !== "string") {
            throw new Error("PDF worker not properly initialized (workerSrc invalid).");
          }

          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

          let fullText = "";
          const numPages = Math.min(pdf.numPages, 5);
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => (item as any).str || "").join(" ");
            fullText += pageText + "\n";
          }
          setResumeText(fullText);
          toast({ title: "Success", description: "PDF resume uploaded." });

        } else if (fname.endsWith('.doc') || fname.endsWith('.docx')) {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/parse-docx', { method: 'POST', body: formData });
            if (!res.ok) {
                const errorBody = await res.json();
                throw new Error(errorBody.error || "Docx parse failed on server");
            }
            const result = await res.json();
            setResumeText(result.text);
            toast({ title: "Success", description: "Word document uploaded." });
        } else {
          throw new Error("Unsupported file type. Please upload a PDF or Word document.");
        }
      } catch (error: any) {
        console.error("File Read Error:", error);
        toast({ variant: 'destructive', title: "Error", description: error.message || "Failed to read the file." });
        setFileName("");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackFromChat = () => {
    setChatStarted(false);
    setResumeText("");
    setExperienceLevel("Fresher Student");
    setFileName("");
  };

  const gyanApiCallPayload = useCallback((query: string, history: Message[]) => {
    return { topic: topicRef.current, question: query, language: languageRef.current, history };
  }, []);

  const interviewApiCallPayload = useCallback((query: string, history: Message[], isInitial = false) => {
    return { resumeText, experienceLevel, history, initialRequest: isInitial, language: languageRef.current };
  }, [resumeText, experienceLevel]);

  if (chatStarted) {
    const isInterview = topic === 'Interview Preparation';
    return (
      <div className="h-full flex flex-col p-4">
        <Button variant="ghost" onClick={handleBackFromChat} className="self-start mb-2"><ArrowLeft className="mr-2"/> Back to Topics</Button>
         <div className="flex-1 min-h-0">
            <ChatInterface
            title={isInterview ? "Interview Preparation" : "Gyan AI"}
            description={isInterview ? `Mock interview for a ${experienceLevel}.` : `Ask anything about ${topic}`}
            initialMessage={isInterview ? "Hello! I have reviewed your resume. Let's begin the interview. Here are your first questions:" : `Hello! I am Gyan AI. Ask me anything about ${topic}.`}
            onBack={handleBackFromChat}
            apiCall={isInterview ? interviewPrepper : gyanAI}
            apiCallPayload={isInterview ? interviewApiCallPayload : gyanApiCallPayload}
            isInterviewPrep={isInterview}
            />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <Button variant="ghost" onClick={onBack} className="self-start mb-2"><ArrowLeft className="mr-2"/> Back to Home</Button>
      <div className="flex-1 flex flex-col bg-card border rounded-lg overflow-hidden">
        <header className="p-4 border-b flex items-center justify-between gap-4">
          <div className='flex items-center gap-4'>
            <div className="bg-primary/10 p-2 rounded-full"><Lightbulb className="w-6 h-6 text-primary"/></div>
            <div>
              <h3 className="font-bold">Gyan AI - Your AI Specialist</h3>
              <p className="text-xs text-muted-foreground">Select a topic and get instant, scientific information.</p>
            </div>
          </div>
        </header>
        <ScrollArea className="flex-grow">
          <div className="p-6">
            <div className="mb-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Choose Topic</label>
                <Select onValueChange={setTopic} defaultValue="Dairy Technology">
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dairy Technology">Dairy Technology</SelectItem>
                    <SelectItem value="Food Safety and Quality">Food Safety and Quality</SelectItem>
                    <SelectItem value="Food Processing">Food Processing</SelectItem>
                    <SelectItem value="Career Guidance in Food Industry">Career Guidance</SelectItem>
                    <SelectItem value="Interview Preparation">Interview Preparation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Choose Language</label>
                <Select onValueChange={setLanguage} defaultValue="English">
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hinglish">Hinglish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {topic === 'Interview Preparation' && (
              <div className="p-4 border-l-4 border-primary bg-primary/10 space-y-4 rounded-r-lg">
                <h4 className='font-bold'>Interview Preparation</h4>
                <p className='text-sm text-muted-foreground'>Upload your resume to start a mock interview with the AI.</p>
                <div>
                  <label htmlFor="experience-level" className="text-sm font-medium mb-1 block">Experience Level</label>
                  <Select onValueChange={setExperienceLevel} defaultValue="Fresher Student">
                    <SelectTrigger id="experience-level"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fresher Student">Fresher Student</SelectItem>
                      <SelectItem value="Experienced Person">Experienced Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="resume-file" className="text-sm font-medium mb-1 block">Upload Your Resume (.pdf, .doc, .docx)</label>
                  <div className="flex items-center gap-2">
                    <label htmlFor="resume-file" className="flex-grow">
                      <Button asChild variant="outline" className="w-full cursor-pointer">
                        <span>
                          {fileName ? <FileCheck className="mr-2" /> : <Upload className="mr-2" />}
                          {fileName || "Choose a file..."}
                        </span>
                      </Button>
                      <Input id="resume-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleStartChat} disabled={isLoading || (topic === 'Interview Preparation' && !resumeText)} className="w-full mt-6">
              {isLoading ? <Loader2 className="animate-spin" /> : (topic === 'Interview Preparation' ? "Start Mock Interview" : "Start Chat")}
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function RegisterExpertPage({ onBack }: { onBack: () => void }) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <Button variant="ghost" onClick={() => onBack()}><ArrowLeft className="mr-2" /> Back to Home</Button>
        <div className="bg-card p-6 rounded-xl shadow-lg max-w-2xl mx-auto border mt-6">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-6">Register as a Real Expert</h3>
          <div className="space-y-4">
            <Input placeholder="Full Name" />
            <Input type="number" placeholder="Experience (in years)" />
            <Input placeholder="Specialization (e.g., Dairy Technology)" />
            <Input type="url" placeholder="URL to your photo (Optional)" />
            <Input type="number" placeholder="Fee per hour (₹)" />
            <Button className="w-full bg-green-600 hover:bg-green-700">Register</Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}